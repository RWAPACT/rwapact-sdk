import { stringToBytes32, bytes32ToString, resolveAssetAddress } from "../src/utils/formatting";
import { SUPPORTED_ASSETS } from "../src/constants/assets";

describe("Formatting Utilities", () => {
  it("converts string to bytes32 and back", () => {
    const text = "agent_quant_01";
    const bytes32 = stringToBytes32(text);
    expect(bytes32).toMatch(/^0x[a-fA-F0-9]{64}$/);
    const decoded = bytes32ToString(bytes32);
    expect(decoded).toBe(text);
  });

  it("resolves symbol to contract address", () => {
    const tsla = resolveAssetAddress("TSLA");
    expect(tsla.toLowerCase()).toBe(SUPPORTED_ASSETS.TSLA.address.toLowerCase());

    const aapl = resolveAssetAddress("aapl");
    expect(aapl.toLowerCase()).toBe(SUPPORTED_ASSETS.AAPL.address.toLowerCase());
  });

  it("passes through valid 0x addresses", () => {
    const custom = "0x1234567890123456789012345678901234567890" as const;
    expect(resolveAssetAddress(custom)).toBe(custom);
  });

  it("throws for unknown asset symbols", () => {
    expect(() => resolveAssetAddress("UNKNOWN_TICKER")).toThrow("Unknown asset identifier");
  });
});
