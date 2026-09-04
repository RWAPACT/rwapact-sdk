import { PublicClient } from "viem";
import { KPV_POLICY_VAULT_ABI } from "../abi/KPV_PolicyVault";
import { AssetPolicy, Address } from "../types";
import { resolveAssetAddress } from "../utils/formatting";

export class PolicyModule {
  constructor(
    private readonly client: PublicClient,
    private readonly contractAddress: Address
  ) {}

  /**
   * Reads risk parameters for an asset from the on-chain Policy Vault.
   */
  public async getAssetPolicy(asset: string | Address): Promise<AssetPolicy> {
    const assetAddress = resolveAssetAddress(asset);

    const result = await this.client.readContract({
      address: this.contractAddress,
      abi: KPV_POLICY_VAULT_ABI,
      functionName: "getAssetPolicy",
      args: [assetAddress],
    });

    return {
      isWhitelisted: result.isWhitelisted,
      maxOrderUSD: result.maxOrderUSD,
      dailyVolumeCapUSD: result.dailyVolumeCapUSD,
      maxAllowedSlippageBps: result.maxAllowedSlippageBps,
      requiresMarketHours: result.requiresMarketHours,
    };
  }

  /**
   * Checks policy compliance off-chain or view-call.
   */
  public async checkCompliance(
    asset: string | Address,
    tradeAmountUSD: number | bigint,
    isMarketOpen: boolean,
    slippageBps: number | bigint
  ): Promise<{ isCompliant: boolean; reason: string }> {
    const assetAddress = resolveAssetAddress(asset);

    const result = await this.client.readContract({
      address: this.contractAddress,
      abi: KPV_POLICY_VAULT_ABI,
      functionName: "checkOrderCompliance",
      args: [assetAddress, BigInt(tradeAmountUSD), isMarketOpen, BigInt(slippageBps)],
    });

    return {
      isCompliant: result[0],
      reason: result[1],
    };
  }
}
