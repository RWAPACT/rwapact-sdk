export const PACT_GATE_ABI = [
  {
    type: "function",
    name: "evaluateAndEnforce",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "order",
        type: "tuple",
        components: [
          { name: "agentId", type: "bytes32" },
          { name: "sessionId", type: "bytes32" },
          { name: "asset", type: "address" },
          { name: "tradeAmount", type: "uint256" },
          { name: "isMarketOpen", type: "bool" },
          { name: "estimatedSlippageBps", type: "uint256" },
        ],
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "canTrade", type: "bool" },
          { name: "attestationId", type: "bytes32" },
          { name: "riskScore", type: "uint256" },
          { name: "rejectReason", type: "string" },
          { name: "gasRoute", type: "string" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "riskOracle",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "sessionOracle",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "policyVault",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "attestationRegistry",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "event",
    name: "GateEvaluated",
    inputs: [
      { name: "attestationId", type: "bytes32", indexed: true },
      { name: "agentId", type: "bytes32", indexed: true },
      { name: "sessionId", type: "bytes32", indexed: false },
      { name: "canTrade", type: "bool", indexed: false },
      { name: "riskScore", type: "uint256", indexed: false },
      { name: "rejectReason", type: "string", indexed: false },
    ],
  },
] as const;
