import { PublicClient } from "viem";
import { KAR_ATTESTATION_REGISTRY_ABI } from "../abi/KAR_AttestationRegistry";
import { AttestationRecord, Address, Hash } from "../types";
import { stringToBytes32 } from "../utils/formatting";

export class AttestationModule {
  constructor(
    private readonly client: PublicClient,
    private readonly contractAddress: Address
  ) {}

  /**
   * Retrieves an on-chain ERC-8273 cryptographic risk attestation receipt.
   */
  public async getAttestation(attestationId: string | Hash): Promise<AttestationRecord> {
    const bytesId = attestationId.startsWith("0x") ? (attestationId as Hash) : stringToBytes32(attestationId);

    const result = await this.client.readContract({
      address: this.contractAddress,
      abi: KAR_ATTESTATION_REGISTRY_ABI,
      functionName: "getAttestation",
      args: [bytesId],
    });

    return {
      attestationId: result.attestationId as Hash,
      agentId: result.agentId as Hash,
      asset: result.asset,
      tradeAmount: result.tradeAmount,
      canTrade: result.canTrade,
      riskScore: Number(result.riskScore),
      reasonCode: result.reasonCode,
      timestamp: result.timestamp,
    };
  }

  /**
   * Verifies whether an attestation ID is valid and registered on-chain.
   */
  public async verify(attestationId: string | Hash): Promise<boolean> {
    const bytesId = attestationId.startsWith("0x") ? (attestationId as Hash) : stringToBytes32(attestationId);

    return await this.client.readContract({
      address: this.contractAddress,
      abi: KAR_ATTESTATION_REGISTRY_ABI,
      functionName: "verifyAttestation",
      args: [bytesId],
    });
  }
}
