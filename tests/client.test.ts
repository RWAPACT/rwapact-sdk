import { RWAPactClient } from "../src/client";
import { ROBINHOOD_CHAIN_TESTNET } from "../src/constants/chains";
import { DEFAULT_CONTRACTS } from "../src/constants/contracts";

describe("RWAPactClient", () => {
  it("initializes with default Robinhood Chain configuration", () => {
    const client = new RWAPactClient();
    expect(client.publicClient).toBeDefined();
    expect(client.publicClient.chain?.id).toBe(ROBINHOOD_CHAIN_TESTNET.id);
    expect(client.contracts.PactGate).toBe(DEFAULT_CONTRACTS.PactGate);
    expect(client.gate).toBeDefined();
    expect(client.session).toBeDefined();
    expect(client.attestation).toBeDefined();
    expect(client.policy).toBeDefined();
  });

  it("encodes evaluateAndEnforce calls accurately", () => {
    const client = new RWAPactClient();
    const calldata = client.gate.encodeEvaluateCall({
      agentId: "agent_quant_01",
      sessionId: "sess_rh_001",
      asset: "TSLA",
      tradeAmountUSD: 300,
      isMarketOpen: true,
      estimatedSlippageBps: 150,
    });

    expect(calldata).toMatch(/^0x[a-fA-F0-9]+/);
  });

  it("encodes session creation calls accurately", () => {
    const client = new RWAPactClient();
    const calldata = client.session.encodeCreateSessionCall({
      agentId: "agent_quant_01",
      allowedAsset: "TSLA",
      durationSeconds: 86400,
      budgetUSD: 2000,
      maxTradeSizeUSD: 500,
    });

    expect(calldata).toMatch(/^0x[a-fA-F0-9]+/);
  });

  it("performs offline heuristic evaluation when dryRun is invoked", async () => {
    const client = new RWAPactClient();
    const decision = await client.evaluate({
      agentId: "agent_quant_01",
      sessionId: "sess_rh_001",
      asset: "TSLA",
      tradeAmountUSD: 300,
      isMarketOpen: true,
      estimatedSlippageBps: 150,
    });

    expect(decision).toHaveProperty("canTrade");
    expect(decision).toHaveProperty("riskScore");
    expect(decision).toHaveProperty("rejectReason");
    expect(typeof decision.riskScore).toBe("number");
  });
});
