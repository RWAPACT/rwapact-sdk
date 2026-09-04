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
    address: "0xc1a08259495557e39fde66c8c9b89eeb19fe5c48",
    decimals: 18,
    marketHoursOnly: true,
  },
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc. Tokenized Equity",
    address: "0x5a85260e70a7545d47dfe937f529db3c2a6980ec",
    decimals: 18,
    marketHoursOnly: true,
  },
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corp. Tokenized Equity",
    address: "0x9714a2f59cacb3d4e57a1ea377099ea12af311bc",
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
