import { stringToHex, padHex, hexToString, trim, isAddress } from "viem";
import { SUPPORTED_ASSETS } from "../constants/assets";
import { Address, Hex } from "../types";

/**
 * Converts a string into a 32-byte hexadecimal representation (bytes32).
 */
export function stringToBytes32(text: string): Hex {
  const hex = stringToHex(text);
  return padHex(hex, { size: 32, dir: "right" });
}

/**
 * Converts a 32-byte hexadecimal string back to human-readable text.
 */
export function bytes32ToString(hex: Hex): string {
  try {
    const trimmed = trim(hex, { dir: "right" });
    return hexToString(trimmed);
  } catch {
    return hex;
  }
}

/**
 * Resolves an asset symbol (e.g. 'TSLA') or standard address to a checksummed address.
 */
export function resolveAssetAddress(asset: string | Address): Address {
  if (asset.startsWith("0x")) {
    if (!isAddress(asset)) {
      throw new Error(`Invalid address: "${asset}" is not a valid 20-byte Ethereum address.`);
    }
    return asset as Address;
  }
  const upper = asset.toUpperCase();
  if (SUPPORTED_ASSETS[upper]) {
    return SUPPORTED_ASSETS[upper].address;
  }
  throw new Error(`Unknown asset identifier: "${asset}". Must be a valid contract address or supported symbol.`);
}
