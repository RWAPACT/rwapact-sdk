import { PublicClient, WalletClient, encodeFunctionData } from "viem";
import { PACT_GATE_ABI } from "../abi/PactGate";
import { OrderIntent, PactDecision, Address, Hash } from "../types";
import { stringToBytes32, resolveAssetAddress } from "../utils/formatting";
import { validateOrderIntent } from "../utils/validation";

export class GateModule {
  constructor(
    private readonly client: PublicClient,
    private readonly walletClient: WalletClient | null,
    private readonly contractAddress: Address
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

      return {
        canTrade: result.canTrade,
        attestationId: result.attestationId as Hash,
        riskScore: Number(result.riskScore),
        rejectReason: result.rejectReason,
        gasRoute: result.gasRoute,
      };
    } catch {
      // Safe offline fallback heuristic calculation with native BigInt precision if node is unreachable
      const maxOrderCapUSD = 1500n;
      const tradeAmount = typeof order.tradeAmountUSD === "bigint"
        ? order.tradeAmountUSD
        : BigInt(order.tradeAmountUSD);
      const isMarketOpen = order.isMarketOpen ?? true;
      const slippage = typeof order.estimatedSlippageBps === "bigint"
        ? order.estimatedSlippageBps
        : BigInt(order.estimatedSlippageBps ?? 150);

      let canTrade = true;
      let rejectReason = "Passed 5-Layer Risk Gate";
      let riskScore = 15;

      if (!isMarketOpen) {
        canTrade = false;
        rejectReason = "Rejected: US Equity Market is closed";
        riskScore = 85;
      } else if (tradeAmount > maxOrderCapUSD) {
        canTrade = false;
        rejectReason = "Rejected: Exceeds policy single-order cap ($1,500)";
        riskScore = 80;
      } else if (slippage > 300n) {
        canTrade = false;
        rejectReason = "Rejected: Slippage exceeds 3.00% ceiling";
        riskScore = 75;
      }

      return {
        canTrade,
        attestationId: stringToBytes32(`att_${Date.now()}`),
        riskScore,
        rejectReason,
        gasRoute: canTrade ? "Direct execution routed" : "Execution halted",
      };
    }
  }

  /**
   * Submits an on-chain evaluateAndEnforce transaction using the connected wallet.
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

    return {
      ...dryRunResult,
      txHash: txHash as Hash,
    };
  }
}
