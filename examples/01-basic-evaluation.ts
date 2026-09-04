import { RWAPactClient } from "../src";

async function main() {
  // Initialize RWAPact client connecting to Robinhood Chain Testnet
  const client = new RWAPactClient();

  console.log("Evaluating autonomous trade intent through RWAPACT 5-Layer Risk Gate...");

  const decision = await client.evaluate({
    agentId: "agent_momentum_alpha",
    sessionId: "sess_prod_001",
    asset: "TSLA", // Tokenized Tesla Equity
    tradeAmountUSD: 450,
    isMarketOpen: true,
    estimatedSlippageBps: 120, // 1.20%
  });

  console.log("Gate Decision:", decision.canTrade ? "APPROVED" : "BLOCKED");
  console.log("Risk Score:", `${decision.riskScore}/100`);
  console.log("Audit Reason:", decision.rejectReason);
  console.log("Gas Route:", decision.gasRoute);
  console.log("Attestation Receipt ID:", decision.attestationId);
}

main().catch(console.error);
