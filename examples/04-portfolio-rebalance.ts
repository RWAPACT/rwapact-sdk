/**
 * Example 04: Portfolio Rebalance Evaluation
 * Demonstrates evaluating rebalance trade intents against RWAPact risk controls.
 */

import { RWAPactClient, resolveAssetAddress } from "../src";

async function main() {
  console.log("=== RWAPACT Portfolio Rebalance Example ===");

  // Initialize read-only client for Robinhood Chain Mainnet (4663)
  const client = new RWAPactClient({ chainId: 4663 });

  // Define rebalance trade intent triggered by portfolio drift
  const rebalanceOrder = {
    agentId: "agent_rebalance_stabilizer",
    sessionId: "sess_rh_rwa_001",
    asset: "NVDA", // Resolves to verified Mainnet NVDA contract
    tradeAmountUSD: 150,
    isMarketOpen: true,
    estimatedSlippageBps: 150, // 1.5%
  };

  console.log("Resolving asset address for NVDA...");
  const assetAddress = resolveAssetAddress(rebalanceOrder.asset);
  console.log(`Resolved NVDA Address: ${assetAddress}`);

  console.log("\nEvaluating rebalancing trade against PactGate on-chain parameters...");
  const decision = await client.evaluate(rebalanceOrder);

  console.log("\nPactGate Rebalance Decision:");
  console.log(`- Approved: ${decision.canTrade ? "YES" : "NO"}`);
  console.log(`- Risk Score: ${decision.riskScore} / 100`);
  console.log(`- Attestation ID: ${decision.attestationId}`);
  if (decision.rejectReason) {
    console.log(`- Reason: ${decision.rejectReason}`);
  }
}

main().catch(console.error);
