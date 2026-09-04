export interface RWAAsset {
  symbol: string;
  name: string;
  address: `0x${string}`;
  decimals: number;
  marketHoursOnly: boolean;
}

export const SUPPORTED_ASSETS: Record<string, RWAAsset> = {
  TSLA: {
    symbol: "TSLA",
    name: "Tesla Inc. Tokenized Equity",
    address: "0x1111111111111111111111111111111111111111",
    decimals: 18,
    marketHoursOnly: true,
  },
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc. Tokenized Equity",
    address: "0x2222222222222222222222222222222222222222",
    decimals: 18,
    marketHoursOnly: true,
  },
  NVDA: {
    symbol: "NVDA",
    name: "Nvidia Corp. Tokenized Equity",
    address: "0x3333333333333333333333333333333333333333",
    decimals: 18,
    marketHoursOnly: true,
  },
  AMZN: {
    symbol: "AMZN",
    name: "Amazon.com Inc. Tokenized Equity",
    address: "0x4444444444444444444444444444444444444444",
    decimals: 18,
    marketHoursOnly: true,
  },
  GME: {
    symbol: "GME",
    name: "GameStop Corp. Tokenized Equity",
    address: "0x9999999999999999999999999999999999999999",
    decimals: 18,
    marketHoursOnly: true,
  },
};
