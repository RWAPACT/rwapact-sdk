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
    name: "Tesla Inc. • Robinhood Token",
    address: "0x322f0929c4625ed5bad873c95208d54e1c003b2d",
    decimals: 18,
    marketHoursOnly: true,
  },
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc. • Robinhood Token",
    address: "0xaf3d76f1834a1d425780943c99ea8a608f8a93f9",
    decimals: 18,
    marketHoursOnly: true,
  },
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corp. • Robinhood Token",
    address: "0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec",
    decimals: 18,
    marketHoursOnly: true,
  },
  SPY: {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF • Robinhood Token",
    address: "0x117cc2133c37b721f49de2a7a74833232b3b4c0c",
    decimals: 18,
    marketHoursOnly: true,
  },
  QQQ: {
    symbol: "QQQ",
    name: "Invesco QQQ • Robinhood Token",
    address: "0xd5f3879160bc7c32ebb4dc785f8a4f505888de68",
    decimals: 18,
    marketHoursOnly: true,
  },
  AMZN: {
    symbol: "AMZN",
    name: "Amazon.com Inc. • Robinhood Token",
    address: "0x12f190a9f9d7d37a250758b26824b97ce941bf54",
    decimals: 18,
    marketHoursOnly: true,
  },
  GOOGL: {
    symbol: "GOOGL",
    name: "Alphabet Class A • Robinhood Token",
    address: "0x2e0847e8910a9732eb3fb1bb4b70a580adad4fe3",
    decimals: 18,
    marketHoursOnly: true,
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corp. • Robinhood Token",
    address: "0xe93237c50d904957cf27e7b1133b510c669c2e74",
    decimals: 18,
    marketHoursOnly: true,
  },
  META: {
    symbol: "META",
    name: "Meta Platforms • Robinhood Token",
    address: "0xc0d6457c16cc70d6790dd43521c899c87ce02f35",
    decimals: 18,
    marketHoursOnly: true,
  },
  COIN: {
    symbol: "COIN",
    name: "Coinbase Global • Robinhood Token",
    address: "0x6330d8c3178a418788df01a47479c0ce7ccf450b",
    decimals: 18,
    marketHoursOnly: true,
  },
};
