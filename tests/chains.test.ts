import { ROBINHOOD_CHAIN, ROBINHOOD_CHAIN_TESTNET, SUPPORTED_CHAINS } from "../src/constants/chains";

describe("Chain Configurations", () => {
  it("should configure Robinhood Chain Mainnet (4663) properly", () => {
    expect(ROBINHOOD_CHAIN.id).toBe(4663);
    expect(ROBINHOOD_CHAIN.name).toBe("Robinhood Chain");
    expect(ROBINHOOD_CHAIN.network).toBe("robinhood-mainnet");
    expect(ROBINHOOD_CHAIN.testnet).toBe(false);
    expect(ROBINHOOD_CHAIN.nativeCurrency.symbol).toBe("ETH");
    expect(ROBINHOOD_CHAIN.nativeCurrency.decimals).toBe(18);
    expect(ROBINHOOD_CHAIN.blockExplorers.default.url).toBe("https://rh-scan.com");
    expect(ROBINHOOD_CHAIN.rpcUrls.default.http[0]).toBe("https://rpc.mainnet.chain.robinhood.com");
  });

  it("should configure Robinhood Chain Testnet (46630) properly", () => {
    expect(ROBINHOOD_CHAIN_TESTNET.id).toBe(46630);
    expect(ROBINHOOD_CHAIN_TESTNET.name).toBe("Robinhood Chain Testnet");
    expect(ROBINHOOD_CHAIN_TESTNET.testnet).toBe(true);
    expect(ROBINHOOD_CHAIN_TESTNET.nativeCurrency.symbol).toBe("ETH");
    expect(ROBINHOOD_CHAIN_TESTNET.blockExplorers.default.url).toBe("https://explorer.testnet.chain.robinhood.com");
    expect(ROBINHOOD_CHAIN_TESTNET.rpcUrls.default.http[0]).toBe("https://rpc.testnet.chain.robinhood.com");
  });

  it("should contain both chains in SUPPORTED_CHAINS", () => {
    expect(SUPPORTED_CHAINS.length).toBe(2);
    expect(SUPPORTED_CHAINS.map(c => c.id)).toEqual([4663, 46630]);
  });

  it("should not expose any private API keys or credentials in RPC URLs", () => {
    SUPPORTED_CHAINS.forEach(chain => {
      chain.rpcUrls.default.http.forEach(url => {
        expect(url).not.toMatch(/alchemy\.com\/v2\/[a-zA-Z0-9]+/);
        expect(url).not.toMatch(/infura\.io\/v3\/[a-zA-Z0-9]+/);
        expect(url).not.toMatch(/key=|apiKey=|token=/i);
      });
    });
  });
});
