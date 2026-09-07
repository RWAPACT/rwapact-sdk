# RWAPACT SDK (`@rwapact/sdk`)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Robinhood Chain Mainnet](https://img.shields.io/badge/Robinhood%20Chain%20Mainnet-4663-3e5c1e.svg)](https://rh-scan.com)
[![Tests Passing](https://img.shields.io/badge/Tests-Passing-success.svg)](https://github.com/RWAPACT/rwapact-sdk)

Official TypeScript/JavaScript SDK for **RWAPACT**: an on-chain risk evaluation and session delegation protocol on Robinhood Chain Mainnet (Chain ID `4663`).

The SDK provides client libraries and utility methods to interact with RWAPACT smart contracts, evaluate trade orders against risk policies, manage ERC-8004 agent sessions, and verify ERC-8273 on-chain attestation receipts.

---

## Core Protocol Architecture

RWAPACT provides a pre-trade validation layer that evaluates trade orders against configurable risk constraints before execution:

```
[ AI Agent / Trader Order ]
            │ (Order Intent)
            ▼
┌─────────────────────────────────────────────────────────────┐
│                    RWAPACT 5-LAYER GATE                     │
│                                                             │
│  [1] KPV (Policy Vault)         - Caps, whitelists, limits  │
│  [2] KSO (Session Oracle)       - ERC-8004 timed delegation │
│  [3] KRO (Risk Oracle)          - Slippage & market hours   │
│  [4] KGR (Gas Router)           - Network gas threshold     │
│  [5] KAR (Attestation Registry) - ERC-8273 audit receipts   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
          [ APPROVED ]                   [ BLOCKED ]
       Attestation Logged             Transaction Reverted
     Eligible for Execution         Violation Code Recorded
```

---

## Key Capabilities

- **PactGate Evaluation**: Dry-run or execute on-chain order verification against the deployed `PactGate` contract.
- **Session Delegation (ERC-8004)**: Create and revoke time-bounded, budget-capped on-chain sessions for automated trading agents.
- **Attestation Verification (ERC-8273)**: Query verified attestation receipts minted to `KAR_AttestationRegistry`.
- **Preconfigured Chain Metadata**: Built-in support for Robinhood Chain Mainnet (`4663`) and Testnet (`46630`) with verified RPCs and block explorer links (`rh-scan.com`).
- **Strict TypeScript Types**: Full typing for order intents, contract ABIs, policy parameters, and simulation responses.

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

// Read-only client connected to Robinhood Chain Mainnet (Chain ID 4663)
const client = new RWAPactClient();

// Signer client for on-chain transactions
const signerClient = new RWAPactClient({
  chainId: 4663,
  privateKey: "0x...", // Your account private key
});
```

### 2. Evaluate a Trade Order Intent

Simulate whether an order intent satisfies risk rules before broadcasting:

```typescript
const decision = await client.evaluate({
  agentId: "agent_quant_alpha",
  sessionId: "sess_rh_rwa_001",
  asset: "TSLA", // Resolves to 0x322f0929c4625ed5bad873c95208d54e1c003b2d
  tradeAmountUSD: 450,
  isMarketOpen: true,
  estimatedSlippageBps: 150, // 1.50%
});

if (decision.canTrade) {
  console.log("Trade Approved! Risk Score:", decision.riskScore);
  console.log("Attestation Hash:", decision.attestationId);
} else {
  console.warn("Trade Blocked:", decision.rejectReason);
}
```

### 3. Create an On-Chain Delegated Session (ERC-8004)

```typescript
const { sessionId, txHash } = await signerClient.createSession({
  agentId: "agent_quant_alpha",
  allowedAsset: "TSLA",
  durationSeconds: 86400, // 24 hours
  budgetUSD: 2000,
  maxTradeSizeUSD: 500,
});

console.log("Session Created:", sessionId);
console.log("Transaction Hash:", txHash);
```

### 4. Verify an Attestation Receipt (ERC-8273)

```typescript
const isValid = await client.verifyAttestation(
  "0x3762e27869aba5b961b40aca0f314c9c93547f4a000000000000000000000000"
);

console.log("Is Attestation Valid:", isValid);
```

---

## Verified On-Chain Deployments

All contracts are deployed and verified on **Robinhood Chain Mainnet (Chain ID `4663`)**:

| Contract | Role | Verified Explorer Link |
| :--- | :--- | :--- |
| **PactGate** | Multi-layer execution & risk gate | [`0xe834c22d...2a4a`](https://rh-scan.com/address/0xe834c22d9692655f2782bd3763b87d37f96c2a4a) |
| **KAR_AttestationRegistry** | ERC-8273 Attestation log storage | [`0x3762e278...7f4a`](https://rh-scan.com/address/0x3762e27869aba5b961b40aca0f314c9c93547f4a) |
| **KSO_SessionOracle** | ERC-8004 Session delegation oracle | [`0xbb81c96d...59f1`](https://rh-scan.com/address/0xbb81c96d0bc3bec1d503fde66ee2e31fbf7595f1) |
| **KPV_PolicyVault** | Policy limits & asset allowlist | [`0xa453c5f1...e11b`](https://rh-scan.com/address/0xa453c5f11f8bac06b137d7e7950dc17ce620e11b) |
| **KRO_RiskOracle** | Price feed freshness & risk metrics | [`0x1b676a73...140d`](https://rh-scan.com/address/0x1b676a731171a1cc4c835e3cce8a9301f1114d0d) |
| **KGR_GasRouter** | Gas evaluation and fee thresholds | [`0xd7b6c0c9...52f3`](https://rh-scan.com/address/0xd7b6c0c92ffb0508700ee49186406b5c27d852f3) |

### Verified Token Contracts

| Token | Name | Verified Explorer Link |
| :--- | :--- | :--- |
| **$RWAPACT** | Protocol Ecosystem Token | [`0x4b1b3CB2...CD65`](https://rh-scan.com/address/0x4b1b3CB23e1cd1eB03eFf3123B6Ccd698629CD65) ([DexScreener](https://dexscreener.com/robinhood/0xce9d08bdd1d984988bfb05a3188c573cf945d14255606e862227577b3a901576)) |
| **TSLA** | Tesla • Robinhood Token | [`0x322f0929...3b2d`](https://rh-scan.com/token/0x322f0929c4625ed5bad873c95208d54e1c003b2d) |
| **AAPL** | Apple • Robinhood Token | [`0xaf3d76f1...93f9`](https://rh-scan.com/token/0xaf3d76f1834a1d425780943c99ea8a608f8a93f9) |
| **NVDA** | NVIDIA • Robinhood Token | [`0xd0601ce1...9eec`](https://rh-scan.com/token/0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec) |
| **SPY** | SPDR S&P 500 ETF • Robinhood Token | [`0x117cc213...4c0c`](https://rh-scan.com/token/0x117cc2133c37b721f49de2a7a74833232b3b4c0c) |
| **QQQ** | Invesco QQQ • Robinhood Token | [`0xd5f38791...de68`](https://rh-scan.com/token/0xd5f3879160bc7c32ebb4dc785f8a4f505888de68) |
| **AMZN** | Amazon.com • Robinhood Token | [`0x12f190a9...bf54`](https://rh-scan.com/token/0x12f190a9f9d7d37a250758b26824b97ce941bf54) |
| **GOOGL** | Alphabet Class A • Robinhood Token | [`0x2e0847e8...4fe3`](https://rh-scan.com/token/0x2e0847e8910a9732eb3fb1bb4b70a580adad4fe3) |
| **MSFT** | Microsoft • Robinhood Token | [`0xe93237c5...2e74`](https://rh-scan.com/token/0xe93237c50d904957cf27e7b1133b510c669c2e74) |
| **META** | Meta Platforms • Robinhood Token | [`0xc0d6457c...2f35`](https://rh-scan.com/token/0xc0d6457c16cc70d6790dd43521c899c87ce02f35) |
| **COIN** | Coinbase • Robinhood Token | [`0x6330d8c3...450b`](https://rh-scan.com/token/0x6330d8c3178a418788df01a47479c0ce7ccf450b) |

---

## Code Examples

Practical, runnable examples are included in the [`examples/`](./examples) directory:

1. [`01-basic-evaluation.ts`](./examples/01-basic-evaluation.ts) - Initializing the client and evaluating trade intents against PactGate.
2. [`02-create-delegated-session.ts`](./examples/02-create-delegated-session.ts) - Creating an on-chain scoped session delegation.
3. [`03-verify-attestation.ts`](./examples/03-verify-attestation.ts) - Reading and validating attestation receipts from KAR.
4. [`04-portfolio-rebalance.ts`](./examples/04-portfolio-rebalance.ts) - Evaluating portfolio drift and formulating rebalance orders.

---

## Running Tests

```bash
npm test
```

Unit tests cover client initialization, chain configuration integrity, parameter validation, asset resolution, and ABI encoding.

---

## Security

For vulnerability disclosures and reporting procedures, refer to [SECURITY.md](./SECURITY.md).

---

## License

MIT License. See [LICENSE](./LICENSE) for details.
