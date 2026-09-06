import { DEPLOYED_CONTRACTS, DEFAULT_CONTRACTS } from "../src/constants/contracts";

describe("Protocol Deployments & Contracts", () => {
  it("should have valid Mainnet (4663) deployments for all 6 protocol contracts", () => {
    const mainnet = DEPLOYED_CONTRACTS[4663];
    expect(mainnet).toBeDefined();

    expect(mainnet.PactGate).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(mainnet.KAR_AttestationRegistry).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(mainnet.KSO_SessionOracle).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(mainnet.KPV_PolicyVault).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(mainnet.KRO_RiskOracle).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(mainnet.KGR_GasRouter).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });

  it("should have valid Testnet (46630) deployments for all 6 protocol contracts", () => {
    const testnet = DEPLOYED_CONTRACTS[46630];
    expect(testnet).toBeDefined();

    expect(testnet.PactGate).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(testnet.KAR_AttestationRegistry).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(testnet.KSO_SessionOracle).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(testnet.KPV_PolicyVault).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(testnet.KRO_RiskOracle).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(testnet.KGR_GasRouter).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });

  it("DEFAULT_CONTRACTS should point to Mainnet (4663)", () => {
    expect(DEFAULT_CONTRACTS).toEqual(DEPLOYED_CONTRACTS[4663]);
    expect(DEFAULT_CONTRACTS.PactGate).toBe("0xe834c22d9692655f2782bd3763b87d37f96c2a4a");
  });
});
