# RWAPACT SDK (`@rwapact/sdk`)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Robinhood Chain](https://img.shields.io/badge/Robinhood%20Chain-46630-3e5c1e.svg)](https://explorer.testnet.chain.robinhood.com)

The official TypeScript/JavaScript SDK for **RWAPACT**: The On-Chain Policy & Risk Firewall for Autonomous AI Agents Trading Real-World Assets (RWA).

> *"RWAPACT does not execute trades. RWAPACT decides whether a trade should execute."*

---

## Architecture Overview

RWAPACT sits directly between AI Agent frameworks (ElizaOS, LangChain, AutoGPT) and execution venues (DEXs, Tokenized Equity Pools). Every trade intent formulated by an autonomous agent is cryptographically intercepted and evaluated across a 5-layer risk gate before any capital can move on-chain:

```
[ Autonomous AI Agent ]
        │ (Trade Intent)
        ▼
┌─────────────────────────────────────────────────────────────┐
│                    RWAPACT 5-LAYER GATE                     │
│                                                             │
│  [1] KPV  Policy Vault         (Allowlists, Max Size, Caps) │
│  [2] KSO  Session Oracle       (ERC-8004 Timed Delegation)  │
│  [3] KRO  Risk Oracle          (Volatility, Slippage Bps)   │
│  [4] KGR  Gas Router           (Predictable Fee Routing)    │
│  [5] KAR  Attestation Registry (ERC-8273 Audit Receipt)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
         [ APPROVED ]                     [ BLOCKED ]
       Attestation Minted              Execution Reverted
     Routed to Execution Pool         Non-compliant Trade Logged
```

---

## Features

- **PactGate Enforcement**: Evaluate trade intents against institutional risk parameters with zero latency.
- **ERC-8004 Agent Delegation**: Create scoped, time-bound, and budget-capped on-chain sessions for autonomous trading agents.
- **ERC-8273 Risk Attestations**: Verify cryptographic audit receipts minted on-chain for regulatory and post-trade compliance.
- **Robinhood Chain Native**: Preconfigured with official smart contract addresses, ABIs, and RPC endpoints for Robinhood Chain Testnet (`46630`).
- **Universal Provider Support**: Supports node-based private keys, Viem clients, or browser-injected Web3 providers.
- **Type-Safe**: 100% strict TypeScript types with full autocompletion for ABIs, events, and contract calls.

---

## Installation

```bash
npm install @rwapact/sdk viem
# or
yarn add @rwapact/sdk viem
# or
pnpm add @rwapact/sdk viem
```

---

## Quickstart

### 1. Initialize the Client

```typescript
import { RWAPactClient } from "@rwapact/sdk";

// Read-only client connected to Robinhood Chain Testnet
const client = new RWAPactClient();

// Or configure with a private key for on-chain execution
const signerClient = new RWAPactClient({
  privateKey: "0x...", // Your account private key
});
```

### 2. Evaluate an Agent Trade Intent

Before sending a transaction, simulate and evaluate whether the order passes institutional risk controls:

```typescript
const decision = await client.evaluate({
  agentId: "agent_quant_alpha",
  sessionId: "sess_rh_rwa_001",
  asset: "TSLA", // Tokenized Tesla Equity
  tradeAmountUSD: 450,
  isMarketOpen: true,
  estimatedSlippageBps: 150, // 1.50%
});

if (decision.canTrade) {
  console.log("Order Approved! Risk Score:", decision.riskScore);
  console.log("Attestation Receipt ID:", decision.attestationId);
} else {
  console.warn("Order Blocked:", decision.rejectReason);
}
```

### 3. Delegate an On-Chain Session (ERC-8004)

Grant an AI agent bounded authority to trade within strict budget, duration, and asset boundaries:

```typescript
const { sessionId, txHash } = await signerClient.createSession({
  agentId: "agent_quant_alpha",
  allowedAsset: "TSLA",
  durationSeconds: 86400, // 24 hours
  budgetUSD: 2000,
  maxTradeSizeUSD: 500,
});

console.log("Session Created on-chain:", sessionId);
console.log("Transaction Hash:", txHash);
```

### 4. Verify an Attestation Receipt (ERC-8273)

Verify on-chain whether a specific trade attestation was cryptographically registered by `PactGate`:

```typescript
const isValid = await client.verifyAttestation(
  "0x48a2f2d1bfc90590f4afa419c1ae204ce259c128000000000000000000000000"
);

console.log("Is Attestation Valid:", isValid);
```

---

## On-Chain Contract Deployments

| Contract | Function | Robinhood Chain Testnet Address |
| :--- | :--- | :--- |
| **PactGate** | Main 5-Layer Risk Firewall | `0xd7f574d8ad33a74022f3655c8ea875c044b8edc3` |
| **KAR_AttestationRegistry** | ERC-8273 Audit Receipts | `0x48a2f2d1bfc90590f4afa419c1ae204ce259c128` |
| **KSO_SessionOracle** | ERC-8004 Agent Delegation | `0xd70b4cf568ff5c264c78314303ef0df9baf8344e` |
| **KPV_PolicyVault** | Institutional Risk Rules | `0xe0f917181190aa032b3568639bd365bb5d2e871b` |
| **KRO_RiskOracle** | Volatility & Slippage Engine | `0x942d6ee4a273d165e1c7cfca6b0032ba89a5e138` |
| **KGR_GasRouter** | Gas Routing & Optimization | `0x3f63122df822cff9508e31aa6471e65834c37425` |

---

## Supported RWA Assets

The SDK provides built-in address mapping for tokenized equities deployed on Robinhood Chain:

| Ticker | Asset Name | Contract Address | Market Hours Enforced |
| :--- | :--- | :--- | :---: |
| `TSLA` | Tesla Inc. Tokenized Equity | `0x1111111111111111111111111111111111111111` | Yes |
| `AAPL` | Apple Inc. Tokenized Equity | `0x2222222222222222222222222222222222222222` | Yes |
| `NVDA` | Nvidia Corp. Tokenized Equity | `0x3333333333333333333333333333333333333333` | Yes |
| `AMZN` | Amazon.com Inc. Tokenized Equity | `0x4444444444444444444444444444444444444444` | Yes |
| `GME` | GameStop Corp. Tokenized Equity | `0x9999999999999999999999999999999999999999` | Yes |

---

## API Reference

### `RWAPactClient`
The primary SDK client coordinating all submodules:
- `client.gate`: `GateModule` for trade evaluation and on-chain enforcement.
- `client.session`: `SessionModule` for managing ERC-8004 delegated agent sessions.
- `client.attestation`: `AttestationModule` for querying and verifying ERC-8273 cryptographic audit proofs.
- `client.policy`: `PolicyModule` for inspecting asset whitelist and position limits.

### Low-Level Utilities
Exported from `@rwapact/sdk/utils`:
- `stringToBytes32(text: string): Hex`: Convert identifiers to standard `bytes32`.
- `bytes32ToString(hex: Hex): string`: Decode on-chain `bytes32` strings.
- `resolveAssetAddress(asset: string | Address): Address`: Resolve ticker symbols or checksummed addresses.

---

## Security

Security is foundational to RWAPACT. To report vulnerabilities or review our bug bounty program, please consult [SECURITY.md](./SECURITY.md).

---

## Community & Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before submitting pull requests.

---

## License

This project is licensed under the [MIT License](./LICENSE).
