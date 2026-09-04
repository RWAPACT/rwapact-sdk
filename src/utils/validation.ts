import { OrderIntent, SessionConfig } from "../types";

export function validateOrderIntent(order: OrderIntent): void {
  if (!order.agentId) {
    throw new Error("Invalid OrderIntent: 'agentId' is required.");
  }
  if (!order.sessionId) {
    throw new Error("Invalid OrderIntent: 'sessionId' is required.");
  }
  if (!order.asset) {
    throw new Error("Invalid OrderIntent: 'asset' is required.");
  }
  const amount = BigInt(order.tradeAmountUSD);
  if (amount <= 0n) {
    throw new Error("Invalid OrderIntent: 'tradeAmountUSD' must be greater than 0.");
  }
}

export function validateSessionConfig(config: SessionConfig): void {
  if (!config.agentId) {
    throw new Error("Invalid SessionConfig: 'agentId' is required.");
  }
  if (!config.allowedAsset) {
    throw new Error("Invalid SessionConfig: 'allowedAsset' is required.");
  }
  if (BigInt(config.durationSeconds) <= 0n) {
    throw new Error("Invalid SessionConfig: 'durationSeconds' must be greater than 0.");
  }
  if (BigInt(config.budgetUSD) <= 0n) {
    throw new Error("Invalid SessionConfig: 'budgetUSD' must be greater than 0.");
  }
  if (BigInt(config.maxTradeSizeUSD) <= 0n) {
    throw new Error("Invalid SessionConfig: 'maxTradeSizeUSD' must be greater than 0.");
  }
  if (BigInt(config.maxTradeSizeUSD) > BigInt(config.budgetUSD)) {
    throw new Error("Invalid SessionConfig: 'maxTradeSizeUSD' cannot exceed total 'budgetUSD'.");
  }
}
