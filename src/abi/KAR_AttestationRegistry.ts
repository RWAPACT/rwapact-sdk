export const KAR_ATTESTATION_REGISTRY_ABI = [
  {
    type: "function",
    name: "recordAttestation",
    stateMutability: "nonpayable",
    inputs: [
      { name: "attestationId", type: "bytes32" },
      { name: "agentId", type: "bytes32" },
      { name: "asset", type: "address" },
      { name: "tradeAmount", type: "uint256" },
      { name: "canTrade", type: "bool" },
      { name: "riskScore", type: "uint256" },
      { name: "reasonCode", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getAttestation",
    stateMutability: "view",
    inputs: [{ name: "attestationId", type: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "attestationId", type: "bytes32" },
          { name: "agentId", type: "bytes32" },
          { name: "asset", type: "address" },
          { name: "tradeAmount", type: "uint256" },
          { name: "canTrade", type: "bool" },
          { name: "riskScore", type: "uint256" },
          { name: "reasonCode", type: "string" },
          { name: "timestamp", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "verifyAttestation",
    stateMutability: "view",
    inputs: [{ name: "attestationId", type: "bytes32" }],
    outputs: [{ name: "isValid", type: "bool" }],
  },
  {
    type: "event",
    name: "AttestationRecorded",
    inputs: [
      { name: "attestationId", type: "bytes32", indexed: true },
      { name: "agentId", type: "bytes32", indexed: true },
      { name: "asset", type: "address", indexed: false },
      { name: "canTrade", type: "bool", indexed: false },
      { name: "riskScore", type: "uint256", indexed: false },
    ],
  },
] as const;
