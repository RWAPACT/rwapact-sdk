export const KPV_POLICY_VAULT_ABI = [
  {
    type: "function",
    name: "getAssetPolicy",
    stateMutability: "view",
    inputs: [{ name: "asset", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "isWhitelisted", type: "bool" },
          { name: "maxOrderUSD", type: "uint256" },
          { name: "dailyVolumeCapUSD", type: "uint256" },
          { name: "maxAllowedSlippageBps", type: "uint256" },
          { name: "requiresMarketHours", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "checkOrderCompliance",
    stateMutability: "view",
    inputs: [
      { name: "asset", type: "address" },
      { name: "tradeAmount", type: "uint256" },
      { name: "isMarketOpen", type: "bool" },
      { name: "estimatedSlippageBps", type: "uint256" },
    ],
    outputs: [
      { name: "isCompliant", type: "bool" },
      { name: "reason", type: "string" },
    ],
  },
] as const;

export const KRO_RISK_ORACLE_ABI = [
  {
    type: "function",
    name: "computeRiskScore",
    stateMutability: "view",
    inputs: [
      { name: "asset", type: "address" },
      { name: "tradeAmount", type: "uint256" },
      { name: "isMarketOpen", type: "bool" },
      { name: "slippageBps", type: "uint256" },
    ],
    outputs: [
      { name: "riskScore", type: "uint256" },
      { name: "riskTier", type: "string" },
    ],
  },
] as const;
