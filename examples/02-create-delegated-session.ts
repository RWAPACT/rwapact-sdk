import { RWAPactClient } from "../src";

async function main() {
  // To sign transactions on-chain, provide a funded private key or browser provider
  const client = new RWAPactClient({
    // privateKey: "0x...",
  });

  console.log("Generating encoded calldata for ERC-8004 Agent Delegation Session...");

  const calldata = client.session.encodeCreateSessionCall({
    agentId: "agent_quant_v2",
    allowedAsset: "TSLA",
    durationSeconds: 86400, // 24 hours
    budgetUSD: 5000,
    maxTradeSizeUSD: 1000,
  });

  console.log("Encoded Transaction Payload (Ready for wallet submission):", calldata);
}

main().catch(console.error);
