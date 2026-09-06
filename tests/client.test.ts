import { RWAPactClient } from "../src/client";
import { ROBINHOOD_CHAIN } from "../src/constants/chains";
import { DEFAULT_CONTRACTS } from "../src/constants/contracts";

describe("RWAPactClient", () => {
  it("initializes with default Robinhood Chain configuration", () => {
    const client = new RWAPactClient();
    expect(client.publicClient).toBeDefined();
    expect(client.publicClient.chain?.id).toBe(ROBINHOOD_CHAIN.id);
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
    expect(decision.canTrade).toBe(true);
  });

  it("safely enforces policy caps on large BigInt orders without overflow", async () => {
    const client = new RWAPactClient();
    const decision = await client.evaluate({
      agentId: "agent_quant_01",
      sessionId: "sess_rh_001",
      asset: "TSLA",
      tradeAmountUSD: 10_000n,
      isMarketOpen: true,
      estimatedSlippageBps: 150n,
    });

    expect(decision.canTrade).toBe(false);
    expect(decision.rejectReason).toContain("Exceeds policy single-order cap");
    expect(decision.riskScore).toBe(80);
  });

  it("safely rejects orders when market is closed", async () => {
    const client = new RWAPactClient();
    const decision = await client.evaluate({
      agentId: "agent_quant_01",
      sessionId: "sess_rh_001",
      asset: "AAPL",
      tradeAmountUSD: 200,
      isMarketOpen: false,
      estimatedSlippageBps: 100,
    });

    expect(decision.canTrade).toBe(false);
    expect(decision.rejectReason).toContain("Market is closed");
    expect(decision.riskScore).toBe(85);
  });

  it("safely rejects orders when slippage exceeds tolerance ceiling", async () => {
    const client = new RWAPactClient();
    const decision = await client.evaluate({
      agentId: "agent_quant_01",
      sessionId: "sess_rh_001",
      asset: "NVDA",
      tradeAmountUSD: 500,
      isMarketOpen: true,
      estimatedSlippageBps: 350n,
    });

    expect(decision.canTrade).toBe(false);
    expect(decision.rejectReason).toContain("Slippage exceeds");
    expect(decision.riskScore).toBe(75);
  });
});
