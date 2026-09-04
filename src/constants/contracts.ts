export interface ProtocolDeployment {
  PactGate: `0x${string}`;
  KAR_AttestationRegistry: `0x${string}`;
  KSO_SessionOracle: `0x${string}`;
  KPV_PolicyVault: `0x${string}`;
  KRO_RiskOracle: `0x${string}`;
  KGR_GasRouter: `0x${string}`;
}

export const DEPLOYED_CONTRACTS: Record<number, ProtocolDeployment> = {
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

export const DEFAULT_CONTRACTS = DEPLOYED_CONTRACTS[46630];
