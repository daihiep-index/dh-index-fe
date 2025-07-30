// User Holdings API Response Types
export interface UserHolding {
  id: string;
  stock_code: string;
  quantity: number;
  value: number; // Giá mua tính theo nghìn VNĐ (cần nhân 1000 để có giá thực tế)
  created_at: string;
  updated_at: string;
  user: string;
}

// WebSocket Data Types - Updated to match actual data structure
export interface StockRealtimeData {
  t: string; // timestamp
  s: string; // symbol
  p: number; // current price
  c: number; // close price
  a: number; // average price
  tv: number; // total volume
  v: number; // volume
  tva: number; // total value
  bfv: number; // buy foreign value
  sfv: number; // sell foreign value
  tbv: number; // total buy volume
  ssv: number; // total sell volume
  pc: number; // price change percentage
  pn: number; // price change
  // Bid quantities
  qb1?: number;
  qb2?: number;
  qb3?: number;
  // Ask quantities
  qa1?: number;
  qa2?: number;
  qa3?: number;
  // Additional optional fields
  e?: string; // event type
  ex?: string; // exchange
  r?: number; // reference price
  ce?: number; // ceiling price
  f?: number; // floor price
  h?: number; // high price
  l?: number; // low price
  o?: number; // open price
  tt?: number;
  bc?: number;
  sc?: number;
  bq?: number;
  sq?: number;
  bfq?: number;
  sfq?: number;
  fr?: number;
  // Bid prices
  pb1?: number;
  pb2?: number;
  pb3?: number;
  // Ask prices
  pa1?: number;
  pa2?: number;
  pa3?: number;
}

export interface WebSocketMessage {
  topic: string;
  data: StockRealtimeData[];
  list?: boolean;
}

export interface WebSocketSubscription {
  event: string;
  topic: string;
  params: string[];
}

// Combined data for UI display
export interface StockHoldingWithRealtimeData {
  id: string;
  stockCode: string;
  quantity: number;
  buyPrice: number; // Giá mua thực tế (VNĐ)
  currentPrice: number; // Giá hiện tại (VNĐ)
  totalValue: number; // quantity * buyPrice (VNĐ)
  currentValue: number; // quantity * currentPrice (VNĐ)
  profitLoss: number; // currentValue - totalValue (VNĐ)
  profitLossPercentage: number; // (profitLoss / totalValue) * 100
  realtimeData?: StockRealtimeData;
}

export interface PortfolioSummary {
  totalInvestment: number; // Sum of all holdings' totalValue
  currentValue: number; // Sum of all holdings' currentValue
  totalProfitLoss: number; // Sum of all holdings' profitLoss
  profitLossPercentage: number; // (totalProfitLoss / totalInvestment) * 100
}
