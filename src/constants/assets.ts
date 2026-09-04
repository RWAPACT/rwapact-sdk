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
    address: "0xcda03b5086e61ad88f2919e87166032cef6111e3",
    decimals: 18,
    marketHoursOnly: true,
  },
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc. Tokenized Equity",
    address: "0x93a5296cdf52c3a885462f0e8067d4b6748be63a",
    decimals: 18,
    marketHoursOnly: true,
  },
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corp. Tokenized Equity",
    address: "0x91dd3c2015acd79a152b57f4e75b2ae8a38c5e65",
    decimals: 18,
    marketHoursOnly: true,
  },
  AMZN: {
    symbol: "AMZN",
    name: "Amazon.com Inc. Tokenized Equity",
    address: "0x50c896caaadf2e26c2c961d37d688bed9fce61b9",
    decimals: 18,
    marketHoursOnly: true,
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corp. Tokenized Equity",
    address: "0x2f6e8b7e90585ee563a0dcbcf8ce7bbffc6e5060",
    decimals: 18,
    marketHoursOnly: true,
  },
  GOOGL: {
    symbol: "GOOGL",
    name: "Alphabet Inc. Tokenized Equity",
    address: "0x4de1821d62db0302fbefe4d9bdc57e8fa591811a",
    decimals: 18,
    marketHoursOnly: true,
  },
};
