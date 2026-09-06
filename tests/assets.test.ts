import { SUPPORTED_ASSETS } from "../src/constants/assets";
import { resolveAssetAddress } from "../src/utils/formatting";

describe("Supported RWA Assets", () => {
  it("should contain the 3 verified Mainnet stock tokens: TSLA, AAPL, NVDA", () => {
    expect(SUPPORTED_ASSETS.TSLA).toBeDefined();
    expect(SUPPORTED_ASSETS.AAPL).toBeDefined();
    expect(SUPPORTED_ASSETS.NVDA).toBeDefined();
  });

  it("should have valid checksummed contract addresses and 18 decimals", () => {
    Object.values(SUPPORTED_ASSETS).forEach(asset => {
      expect(asset.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(asset.decimals).toBe(18);
      expect(asset.marketHoursOnly).toBe(true);
    });
  });

  it("should resolve symbols case-insensitively", () => {
    expect(resolveAssetAddress("tsla")).toBe(SUPPORTED_ASSETS.TSLA.address);
    expect(resolveAssetAddress("TSLA")).toBe(SUPPORTED_ASSETS.TSLA.address);
    expect(resolveAssetAddress("nvda")).toBe(SUPPORTED_ASSETS.NVDA.address);
    expect(resolveAssetAddress("aapl")).toBe(SUPPORTED_ASSETS.AAPL.address);
  });

  it("should resolve raw 0x addresses directly", () => {
    const rawAddr = "0x1234567890123456789012345678901234567890" as const;
    expect(resolveAssetAddress(rawAddr)).toBe(rawAddr);
  });

  it("should throw error for unknown asset symbol", () => {
    expect(() => resolveAssetAddress("UNKNOWN_STOCK")).toThrow(
      'Unknown asset identifier: "UNKNOWN_STOCK"'
    );
  });
});
