import { PublicClient, WalletClient, encodeFunctionData } from "viem";
import { KSO_SESSION_ORACLE_ABI } from "../abi/KSO_SessionOracle";
import { SessionConfig, SessionRecord, Address, Hash } from "../types";
import { stringToBytes32, resolveAssetAddress } from "../utils/formatting";
import { validateSessionConfig } from "../utils/validation";

export class SessionModule {
  constructor(
    private readonly client: PublicClient,
    private readonly walletClient: WalletClient | null,
    private readonly contractAddress: Address
  ) {}

  /**
   * Encodes calldata for creating an ERC-8004 agent session.
   */
  public encodeCreateSessionCall(config: SessionConfig): `0x${string}` {
    validateSessionConfig(config);
    const sessionIdBytes = config.sessionId ? stringToBytes32(config.sessionId) : stringToBytes32(`sess_${Date.now()}`);
    const agentIdBytes = stringToBytes32(config.agentId);
    const assetAddress = resolveAssetAddress(config.allowedAsset);

    return encodeFunctionData({
      abi: KSO_SESSION_ORACLE_ABI,
      functionName: "createSession",
      args: [
        sessionIdBytes,
        agentIdBytes,
        BigInt(config.durationSeconds),
        BigInt(config.budgetUSD),
        assetAddress,
        BigInt(config.maxTradeSizeUSD),
      ],
    });
  }

  /**
   * Submits an on-chain transaction to register a delegated agent session.
   */
  public async createSession(config: SessionConfig): Promise<{ sessionId: Hash; txHash: Hash }> {
    if (!this.walletClient || !this.walletClient.account) {
      throw new Error("Cannot create session: No wallet client or account configured.");
    }

    validateSessionConfig(config);

    const sessionIdBytes = config.sessionId
      ? stringToBytes32(config.sessionId)
      : stringToBytes32(`sess_${Date.now()}`);
    const agentIdBytes = stringToBytes32(config.agentId);
    const assetAddress = resolveAssetAddress(config.allowedAsset);

    const data = encodeFunctionData({
      abi: KSO_SESSION_ORACLE_ABI,
      functionName: "createSession",
      args: [
        sessionIdBytes,
        agentIdBytes,
        BigInt(config.durationSeconds),
        BigInt(config.budgetUSD),
        assetAddress,
        BigInt(config.maxTradeSizeUSD),
      ],
    });

    const txHash = await this.walletClient.sendTransaction({
      account: this.walletClient.account,
      to: this.contractAddress,
      data,
      chain: this.walletClient.chain,
    });

    return {
      sessionId: sessionIdBytes as Hash,
      txHash: txHash as Hash,
    };
  }

  /**
   * Queries session status from the on-chain Session Oracle.
   */
  public async getSession(sessionId: string | Hash): Promise<SessionRecord> {
    const bytesId = sessionId.startsWith("0x") ? (sessionId as Hash) : stringToBytes32(sessionId);

    const result = await this.client.readContract({
      address: this.contractAddress,
      abi: KSO_SESSION_ORACLE_ABI,
      functionName: "getSession",
      args: [bytesId],
    });

    return {
      sessionId: bytesId,
      delegator: result.delegator,
      agentId: result.agentId as Hash,
      expiry: result.expiry,
      budget: result.budget,
      spent: result.spent,
      allowedAsset: result.allowedAsset,
      maxTradeSize: result.maxTradeSize,
      isActive: result.isActive,
    };
  }

  /**
   * Revokes an active delegated agent session.
   */
  public async revokeSession(sessionId: string | Hash): Promise<Hash> {
    if (!this.walletClient || !this.walletClient.account) {
      throw new Error("Cannot revoke session: No wallet client or account configured.");
    }

    const bytesId = sessionId.startsWith("0x") ? (sessionId as Hash) : stringToBytes32(sessionId);

    const data = encodeFunctionData({
      abi: KSO_SESSION_ORACLE_ABI,
      functionName: "revokeSession",
      args: [bytesId],
    });

    const txHash = await this.walletClient.sendTransaction({
      account: this.walletClient.account,
      to: this.contractAddress,
      data,
      chain: this.walletClient.chain,
    });

    return txHash as Hash;
  }
}
