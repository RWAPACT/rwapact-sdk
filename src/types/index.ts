export type Address = `0x${string}`;
export type Hash = `0x${string}`;
export type Hex = `0x${string}`;

export interface SDKConfig {
  rpcUrl?: string;
  chainId?: number;
  privateKey?: Hash;
  contracts?: {
    PactGate?: Address;
    KAR_AttestationRegistry?: Address;
    KSO_SessionOracle?: Address;
    KPV_PolicyVault?: Address;
    KRO_RiskOracle?: Address;
    KGR_GasRouter?: Address;
  };
}

export interface OrderIntent {
  agentId: string;
  sessionId: string;
  asset: Address | string; // Address or asset symbol (TSLA, AAPL, etc.)
  tradeAmountUSD: number | bigint;
  isMarketOpen?: boolean;
  estimatedSlippageBps?: number | bigint;
}

export interface PactDecision {
  canTrade: boolean;
  attestationId: Hash;
  riskScore: number;
  rejectReason: string;
  gasRoute: string;
  txHash?: Hash;
}

export interface SessionConfig {
  sessionId?: string;
  agentId: string;
  durationSeconds: number | bigint;
  budgetUSD: number | bigint;
  allowedAsset: Address | string;
  maxTradeSizeUSD: number | bigint;
}

export interface SessionRecord {
  sessionId: Hash;
  delegator: Address;
  agentId: Hash;
  expiry: bigint;
  budget: bigint;
  spent: bigint;
  allowedAsset: Address;
  maxTradeSize: bigint;
  isActive: boolean;
}

export interface AttestationRecord {
  attestationId: Hash;
  agentId: Hash;
  asset: Address;
  tradeAmount: bigint;
  canTrade: boolean;
  riskScore: number;
  reasonCode: string;
  timestamp: bigint;
}

export interface AssetPolicy {
  isWhitelisted: boolean;
  maxOrderUSD: bigint;
  dailyVolumeCapUSD: bigint;
  maxAllowedSlippageBps: bigint;
  requiresMarketHours: boolean;
}

export type RiskTier = "MINIMAL" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface RiskAnalysis {
  riskScore: number;
  riskTier: RiskTier;
  factors: {
    marketHoursPassed: boolean;
    slippageAcceptable: boolean;
    withinSizeLimit: boolean;
    sessionValid: boolean;
  };
}
