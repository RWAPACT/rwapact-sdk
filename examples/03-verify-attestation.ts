import { RWAPactClient } from "../src";

async function main() {
  const client = new RWAPactClient();

  const attestationId = "0x48a2f2d1bfc90590f4afa419c1ae204ce259c128000000000000000000000000";

  console.log(`Verifying ERC-8273 Attestation ${attestationId}...`);

  const isValid = await client.verifyAttestation(attestationId);
  console.log("On-Chain Verification Status:", isValid ? "VALID" : "NOT FOUND / INVALID");
}

main().catch(console.error);
