export const KSO_SESSION_ORACLE_ABI = [
  {
    type: "function",
    name: "createSession",
    stateMutability: "nonpayable",
    inputs: [
      { name: "sessionId", type: "bytes32" },
      { name: "agentId", type: "bytes32" },
      { name: "durationSeconds", type: "uint256" },
      { name: "budget", type: "uint256" },
      { name: "allowedAsset", type: "address" },
      { name: "maxTradeSize", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bytes32" }],
  },
  {
    type: "function",
    name: "revokeSession",
    stateMutability: "nonpayable",
    inputs: [{ name: "sessionId", type: "bytes32" }],
    outputs: [],
  },
  {
    type: "function",
    name: "validateSession",
    stateMutability: "view",
    inputs: [
      { name: "sessionId", type: "bytes32" },
      { name: "agentId", type: "bytes32" },
      { name: "tradeAmount", type: "uint256" },
      { name: "asset", type: "address" },
    ],
    outputs: [
      { name: "isValid", type: "bool" },
      { name: "reason", type: "string" },
    ],
  },
  {
    type: "function",
    name: "getSession",
    stateMutability: "view",
    inputs: [{ name: "sessionId", type: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "delegator", type: "address" },
          { name: "agentId", type: "bytes32" },
          { name: "expiry", type: "uint256" },
          { name: "budget", type: "uint256" },
          { name: "spent", type: "uint256" },
          { name: "allowedAsset", type: "address" },
          { name: "maxTradeSize", type: "uint256" },
          { name: "isActive", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "event",
    name: "SessionCreated",
    inputs: [
      { name: "sessionId", type: "bytes32", indexed: true },
      { name: "delegator", type: "address", indexed: true },
      { name: "agentId", type: "bytes32", indexed: true },
      { name: "budget", type: "uint256", indexed: false },
      { name: "expiry", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "SessionRevoked",
    inputs: [
      { name: "sessionId", type: "bytes32", indexed: true },
      { name: "delegator", type: "address", indexed: true },
    ],
  },
] as const;
