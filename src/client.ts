import {
  createPublicClient,
  createWalletClient,
  http,
  PublicClient,
  WalletClient,
  custom,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { ROBINHOOD_CHAIN, ROBINHOOD_CHAIN_TESTNET } from "./constants/chains";
import { DEFAULT_CONTRACTS, ProtocolDeployment } from "./constants/contracts";
import { GateModule } from "./modules/gate";
import { SessionModule } from "./modules/session";
import { AttestationModule } from "./modules/attestation";
import { PolicyModule } from "./modules/policy";
import { SDKConfig, OrderIntent, PactDecision, SessionConfig, EIP1193Provider } from "./types";

export class RWAPactClient {
  public readonly publicClient: PublicClient;
  public readonly walletClient: WalletClient | null = null;
  public readonly contracts: ProtocolDeployment;

  public readonly gate: GateModule;
  public readonly session: SessionModule;
  public readonly attestation: AttestationModule;
  public readonly policy: PolicyModule;

  constructor(config: SDKConfig = {}) {
    const defaultChain = config.chainId === 46630 ? ROBINHOOD_CHAIN_TESTNET : ROBINHOOD_CHAIN;
    const rpcUrl = config.rpcUrl || defaultChain.rpcUrls.default.http[0];
    const chain = {
      ...defaultChain,
      id: config.chainId || defaultChain.id,
    };

    this.contracts = {
      ...DEFAULT_CONTRACTS,
      ...(config.contracts || {}),
    };

    this.publicClient = createPublicClient({
      chain,
      transport: http(rpcUrl),
    });

    if (config.privateKey) {
      const account = privateKeyToAccount(config.privateKey);
      this.walletClient = createWalletClient({
        account,
        chain,
        transport: http(rpcUrl),
      });
    } else if (config.provider) {
      this.walletClient = createWalletClient({
        chain,
        transport: custom(config.provider),
      });
    }

    this.gate = new GateModule(this.publicClient, this.walletClient, this.contracts.PactGate);
    this.session = new SessionModule(this.publicClient, this.walletClient, this.contracts.KSO_SessionOracle);
    this.attestation = new AttestationModule(this.publicClient, this.contracts.KAR_AttestationRegistry);
    this.policy = new PolicyModule(this.publicClient, this.contracts.KPV_PolicyVault);
  }

  /**
   * Initializes client with a browser-injected EIP-1193 Web3 provider.
   */
  public static fromProvider(provider: EIP1193Provider, config: Omit<SDKConfig, "privateKey" | "provider"> = {}): RWAPactClient {
    return new RWAPactClient({ ...config, provider });
  }

  /**
   * Shortcut: Evaluates an autonomous agent trade intent through the 5-layer risk gate.
   */
  public async evaluate(order: OrderIntent): Promise<PactDecision> {
    return this.gate.dryRun(order);
  }

  /**
   * Shortcut: Evaluates and enforces an agent order on-chain.
   */
  public async enforce(order: OrderIntent): Promise<PactDecision> {
    return this.gate.execute(order);
  }

  /**
   * Shortcut: Creates a delegated ERC-8004 on-chain agent session.
   */
  public async createSession(config: SessionConfig) {
    return this.session.createSession(config);
  }

  /**
   * Shortcut: Verifies an ERC-8273 cryptographic risk attestation.
   */
  public async verifyAttestation(attestationId: string) {
    return this.attestation.verify(attestationId);
  }
}
