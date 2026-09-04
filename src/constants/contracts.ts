export interface ProtocolDeployment {
  PactGate: `0x${string}`;
  KAR_AttestationRegistry: `0x${string}`;
  KSO_SessionOracle: `0x${string}`;
  KPV_PolicyVault: `0x${string}`;
  KRO_RiskOracle: `0x${string}`;
  KGR_GasRouter: `0x${string}`;
}

export const DEPLOYED_CONTRACTS: Record<number, ProtocolDeployment> = {
  // Robinhood Chain Mainnet (4663)
  4663: {
    PactGate: "0xe834c22d9692655f2782bd3763b87d37f96c2a4a",
    KAR_AttestationRegistry: "0x3762e27869aba5b961b40aca0f314c9c93547f4a",
    KSO_SessionOracle: "0xbb81c96d0bc3bec1d503fde66ee2e31fbf7595f1",
    KPV_PolicyVault: "0xa453c5f11f8bac06b137d7e7950dc17ce620e11b",
    KRO_RiskOracle: "0x1b676a731171a1cc4c835e3cce8a9301f1114d0d",
    KGR_GasRouter: "0xd7b6c0c92ffb0508700ee49186406b5c27d852f3",
  },
  // Robinhood Chain Testnet (46630)
  46630: {
    PactGate: "0xd7f574d8ad33a74022f3655c8ea875c044b8edc3",
    KAR_AttestationRegistry: "0x48a2f2d1bfc90590f4afa419c1ae204ce259c128",
    KSO_SessionOracle: "0xd70b4cf568ff5c264c78314303ef0df9baf8344e",
    KPV_PolicyVault: "0xe0f917181190aa032b3568639bd365bb5d2e871b",
    KRO_RiskOracle: "0x942d6ee4a273d165e1c7cfca6b0032ba89a5e138",
    KGR_GasRouter: "0x3f63122df822cff9508e31aa6471e65834c37425",
  },
};

export const DEFAULT_CONTRACTS = DEPLOYED_CONTRACTS[4663];
