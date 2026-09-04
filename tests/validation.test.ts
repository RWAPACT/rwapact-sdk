import { validateOrderIntent, validateSessionConfig } from "../src/utils/validation";

describe("Validation Utilities", () => {
  it("validates correct OrderIntent", () => {
    expect(() =>
      validateOrderIntent({
        agentId: "agent_01",
        sessionId: "sess_01",
        asset: "TSLA",
        tradeAmountUSD: 250,
      })
    ).not.toThrow();
  });

  it("throws on empty agentId or sessionId", () => {
    expect(() =>
      validateOrderIntent({
        agentId: "",
        sessionId: "sess_01",
        asset: "TSLA",
        tradeAmountUSD: 250,
      })
    ).toThrow("agentId' is required");

    expect(() =>
      validateOrderIntent({
        agentId: "agent_01",
        sessionId: "",
        asset: "TSLA",
        tradeAmountUSD: 250,
      })
    ).toThrow("sessionId' is required");
  });

  it("throws on non-positive trade amount", () => {
    expect(() =>
      validateOrderIntent({
        agentId: "agent_01",
        sessionId: "sess_01",
        asset: "TSLA",
        tradeAmountUSD: 0,
      })
    ).toThrow("must be greater than 0");
  });

  it("validates session configuration limits", () => {
    expect(() =>
      validateSessionConfig({
        agentId: "agent_01",
        allowedAsset: "TSLA",
        durationSeconds: 86400,
        budgetUSD: 1000,
        maxTradeSizeUSD: 1500, // exceeds budget
      })
    ).toThrow("maxTradeSizeUSD' cannot exceed total 'budgetUSD'");
  });
});
