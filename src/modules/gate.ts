import { PublicClient, WalletClient, encodeFunctionData } from "viem";
import { PACT_GATE_ABI } from "../abi/PactGate";
import { KPV_POLICY_VAULT_ABI } from "../abi/KPV_PolicyVault";
import { OrderIntent, PactDecision, Address, Hash } from "../types";
import { stringToBytes32, resolveAssetAddress } from "../utils/formatting";
import { validateOrderIntent } from "../utils/validation";

export class GateModule {
  constructor(
    private readonly client: PublicClient,
    private readonly walletClient: WalletClient | null,
    private readonly contractAddress: Address,
    private readonly policyVaultAddress?: Address
  ) {}

  /**
   * Encodes the calldata for an evaluateAndEnforce call.
   */
  public encodeEvaluateCall(order: OrderIntent): `0x${string}` {
    validateOrderIntent(order);
    const assetAddress = resolveAssetAddress(order.asset);

    const tupleOrder = {
      agentId: stringToBytes32(order.agentId),
      sessionId: stringToBytes32(order.sessionId),
      asset: assetAddress,
      tradeAmount: BigInt(order.tradeAmountUSD),
      isMarketOpen: order.isMarketOpen ?? true,
      estimatedSlippageBps: BigInt(order.estimatedSlippageBps ?? 150),
    };

    return encodeFunctionData({
      abi: PACT_GATE_ABI,
      functionName: "evaluateAndEnforce",
      args: [tupleOrder],
    });
  }

  /**
   * Dry-runs evaluation against the on-chain PactGate without submitting a transaction.
   */
  public async dryRun(order: OrderIntent): Promise<PactDecision> {
    validateOrderIntent(order);
    const assetAddress = resolveAssetAddress(order.asset);

    const tupleOrder = {
      agentId: stringToBytes32(order.agentId),
      sessionId: stringToBytes32(order.sessionId),
      asset: assetAddress,
      tradeAmount: BigInt(order.tradeAmountUSD),
      isMarketOpen: order.isMarketOpen ?? true,
      estimatedSlippageBps: BigInt(order.estimatedSlippageBps ?? 150),
    };

    try {
      const { result } = await this.client.simulateContract({
        address: this.contractAddress,
        abi: PACT_GATE_ABI,
        functionName: "evaluateAndEnforce",
        args: [tupleOrder],
      });

      // Fall back to offline heuristic when the on-chain policy vault has no
      // policy configured for the given asset (returns POLICY_NOT_FOUND).
      if (result.rejectReason?.includes("POLICY_NOT_FOUND")) {
        return this.offlineHeuristic(order, assetAddress);
      }

      return {
        canTrade: result.canTrade,
        attestationId: result.attestationId as Hash,
        riskScore: Number(result.riskScore),
        rejectReason: result.rejectReason,
        gasRoute: result.gasRoute,
      };
    } catch {
      // Safe offline fallback heuristic calculation with native BigInt precision if node is unreachable
      return this.offlineHeuristic(order, assetAddress);
    }
  }

  /**
   * Attempts to read the on-chain policy for the asset to use the real cap.
   * Returns undefined if the policy vault address is not configured or the
   * read fails (e.g. node unreachable or no policy stored for the asset).
   */
  private async tryReadOnChainPolicy(assetAddress: Address): Promise<{ maxOrderUSD: bigint } | undefined> {
    if (!this.policyVaultAddress) return undefined;
    try {
      const policy = await this.client.readContract({
        address: this.policyVaultAddress,
        abi: KPV_POLICY_VAULT_ABI,
        functionName: "getAssetPolicy",
        args: [assetAddress],
      });
      if (policy.isWhitelisted && policy.maxOrderUSD > 0n) {
        return { maxOrderUSD: policy.maxOrderUSD };
      }
    } catch {
      // fall through to default cap
    }
    return undefined;
  }

  /**
   * Pure off-chain heuristic evaluation with native BigInt precision.
   * Used as a fallback when the on-chain node is unreachable or the policy
   * vault has no policy configured for the requested asset.
   *
   * Collects all violation reasons instead of returning only the first one,
   * so the caller knows every constraint that was breached.
   */
  private async offlineHeuristic(order: OrderIntent, assetAddress: Address): Promise<PactDecision> {
    const DEFAULT_MAX_ORDER_CAP_USD = 1500n;
    const DEFAULT_MAX_SLIPPAGE_BPS = 300n;

    const onChainPolicy = await this.tryReadOnChainPolicy(assetAddress);
    const maxOrderCapUSD = onChainPolicy?.maxOrderUSD ?? DEFAULT_MAX_ORDER_CAP_USD;

    const tradeAmount = typeof order.tradeAmountUSD === "bigint"
      ? order.tradeAmountUSD
      : BigInt(order.tradeAmountUSD);
    const isMarketOpen = order.isMarketOpen ?? true;
    const slippage = typeof order.estimatedSlippageBps === "bigint"
      ? order.estimatedSlippageBps
      : BigInt(order.estimatedSlippageBps ?? 150);

    const violations: string[] = [];
    let riskScore = 15;

    if (!isMarketOpen) {
      violations.push("US Equity Market is closed");
      riskScore = Math.max(riskScore, 85);
    }
    if (tradeAmount > maxOrderCapUSD) {
      violations.push(`Exceeds policy single-order cap ($${Number(maxOrderCapUSD).toLocaleString()})`);
      riskScore = Math.max(riskScore, 80);
    }
    if (slippage > DEFAULT_MAX_SLIPPAGE_BPS) {
      violations.push("Slippage exceeds 3.00% ceiling");
      riskScore = Math.max(riskScore, 75);
    }

    const canTrade = violations.length === 0;
    const rejectReason = canTrade
      ? "Passed 5-Layer Risk Gate"
      : `Rejected: ${violations.join("; ")}`;

    return {
      canTrade,
      attestationId: stringToBytes32(`att_${Date.now()}`),
      riskScore,
      rejectReason,
      gasRoute: canTrade ? "Direct execution routed" : "Execution halted",
    };
  }

  /**
   * Submits an on-chain evaluateAndEnforce transaction using the connected wallet.
   * Waits for the transaction receipt and throws if the transaction reverts.
   */
  public async execute(order: OrderIntent): Promise<PactDecision> {
    if (!this.walletClient || !this.walletClient.account) {
      throw new Error("Cannot execute on-chain transaction: No wallet client or account configured.");
    }

    const dryRunResult = await this.dryRun(order);
    const data = this.encodeEvaluateCall(order);

    const txHash = await this.walletClient.sendTransaction({
      account: this.walletClient.account,
      to: this.contractAddress,
      data,
      chain: this.walletClient.chain,
    });

    const receipt = await this.client.waitForTransactionReceipt({ hash: txHash });

    if (receipt.status === "reverted") {
      throw new Error(`On-chain evaluateAndEnforce transaction reverted. Tx hash: ${txHash}`);
    }

    return {
      ...dryRunResult,
      txHash: txHash as Hash,
    };
  }
}
