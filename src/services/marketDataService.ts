/**
 * Market Data Service — Indian Market Focus
 * 
 * Architecture: Plug in any API by setting environment variables.
 * 
 * Supported providers:
 *   - Finnhub:      VITE_MARKET_API_PROVIDER=finnhub,     VITE_MARKET_API_KEY=<key>
 *   - Alpha Vantage: VITE_MARKET_API_PROVIDER=alphavantage, VITE_MARKET_API_KEY=<key>
 *   - Twelve Data:  VITE_MARKET_API_PROVIDER=twelvedata,   VITE_MARKET_API_KEY=<key>
 *   - Polygon.io:   VITE_MARKET_API_PROVIDER=polygon,      VITE_MARKET_API_KEY=<key>
 * 
 * Without an API key the service uses realistic simulated data with jitter.
 */

import { isIndianMarketOpen } from "@/lib/formatINR";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface MarketIndex {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  status: "open" | "closed";
  region: "india" | "global";
}
export interface StockItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  sector?: string;
}
export interface CommodityItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  unit: string;
}
export interface ChartPoint {
  time: string;
  value: number;
}
export interface MarketSnapshot {
  indices: MarketIndex[];
  topGainers: StockItem[];
  topLosers: StockItem[];
  commodities: CommodityItem[];
  niftyChart: ChartPoint[];
  sensexChart: ChartPoint[];
  lastUpdated: Date;
}
// ─── Config ──────────────────────────────────────────────────────────────────
const API_KEY = import.meta.env.VITE_MARKET_API_KEY as string | undefined;
const API_PROVIDER = (import.meta.env.VITE_MARKET_API_PROVIDER as string | undefined) ?? "simulated";
export const isLiveMode = (): boolean => !!API_KEY && API_PROVIDER !== "simulated";
// ─── Provider endpoints (for future live integration) ────────────────────────
const PROVIDER_URLS: Record<string, string> = {
  finnhub: "https://finnhub.io/api/v1",
  alphavantage: "https://www.alphavantage.co/query",
  twelvedata: "https://api.twelvedata.com",
  polygon: "https://api.polygon.io/v2",
};
export function getProviderConfig() {
  return {
    provider: API_PROVIDER,
    apiKey: API_KEY ?? "",
    baseUrl: PROVIDER_URLS[API_PROVIDER] ?? "",
    isLive: isLiveMode(),
  };
}
// ─── Simulated Data ──────────────────────────────────────────────────────────
function jitter(base: number, maxPercent = 0.12): number {
  const delta = base * (maxPercent / 100) * (Math.random() * 2 - 1);
  return parseFloat((base + delta).toFixed(2));
}
function generateChart(base: number, points: number): ChartPoint[] {
  const data: ChartPoint[] = [];
  let val = base;
  const now = new Date();
  for (let i = points; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 5 * 60 * 1000);
    val = jitter(val, 0.08);
    data.push({ time: t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }), value: val });
  }
  return data;
}

const marketOpen = isIndianMarketOpen();

const BASE_INDICES: MarketIndex[] = [
 // Indian indices first
  { id: "sensex", name: "SENSEX", symbol: "BSE", price: 79842.32, change: 312.45, changePercent: 0.39, status: marketOpen ? "open" : "closed", region: "india" },
  { id: "nifty", name: "NIFTY 50", symbol: "NSE", price: 24178.65, change: 98.7, changePercent: 0.41, status: marketOpen ? "open" : "closed", region: "india" },
  { id: "niftybank", name: "NIFTY BANK", symbol: "NSEBANK", price: 51245.80, change: 245.30, changePercent: 0.48, status: marketOpen ? "open" : "closed", region: "india" },
  { id: "niftymidcap", name: "NIFTY MIDCAP", symbol: "NSEMID", price: 14532.40, change: -67.20, changePercent: -0.46, status: marketOpen ? "open" : "closed", region: "india" },
  { id: "niftysmallcap", name: "NIFTY SMALLCAP", symbol: "NSESML", price: 8245.15, change: 32.80, changePercent: 0.40, status: marketOpen ? "open" : "closed", region: "india" },
  // Global indices
  { id: "nasdaq", name: "NASDAQ", symbol: "IXIC", price: 19112.32, change: -45.23, changePercent: -0.24, status: "closed", region: "global" },
  { id: "sp500", name: "S&P 500", symbol: "SPX", price: 5998.74, change: 22.18, changePercent: 0.37, status: "closed", region: "global" },
  { id: "dowjones", name: "DOW JONES", symbol: "DJI", price: 42840.26, change: -128.91, changePercent: -0.3, status: "closed", region: "global" },
];
const BASE_GAINERS: StockItem[] = [
  { id: "tcs", name: "TCS", symbol: "TCS", price: 4125.50, change: 78.30, changePercent: 1.93, sector: "IT" },
  { id: "reliance", name: "Reliance Industries", symbol: "RELIANCE", price: 2945.80, change: 52.15, changePercent: 1.80, sector: "Energy" },
  { id: "hdfcbank", name: "HDFC Bank", symbol: "HDFCBANK", price: 1687.40, change: 28.60, changePercent: 1.72, sector: "Banking" },
  { id: "infy", name: "Infosys", symbol: "INFY", price: 1892.25, change: 29.45, changePercent: 1.58, sector: "IT" },
  { id: "icicibank", name: "ICICI Bank", symbol: "ICICIBANK", price: 1245.70, change: 18.30, changePercent: 1.49, sector: "Banking" },
  { id: "bhartiairtel", name: "Bharti Airtel", symbol: "BHARTIARTL", price: 1678.90, change: 22.40, changePercent: 1.35, sector: "Telecom" },
  { id: "sbin", name: "State Bank of India", symbol: "SBIN", price: 832.60, change: 10.25, changePercent: 1.25, sector: "Banking" },
];
const BASE_LOSERS: StockItem[] = [
    { id: "adanient", name: "Adani Enterprises", symbol: "ADANIENT", price: 2678.90, change: -68.40, changePercent: -2.49, sector: "Infrastructure" },
    { id: "tatamotors", name: "Tata Motors", symbol: "TATAMOTORS", price: 785.30, change: -15.60, changePercent: -1.95, sector: "Auto" },
    { id: "wipro", name: "Wipro", symbol: "WIPRO", price: 478.50, change: -8.90, changePercent: -1.83, sector: "IT" },
    { id: "sunpharma", name: "Sun Pharma", symbol: "SUNPHARMA", price: 1567.20, change: -24.80, changePercent: -1.56, sector: "Pharma" },
    { id: "bajfinance", name: "Bajaj Finance", symbol: "BAJFINANCE", price: 6890.40, change: -98.50, changePercent: -1.41, sector: "Finance" },
    { id: "ltim", name: "LTIMindtree", symbol: "LTIM", price: 5432.10, change: -72.30, changePercent: -1.31, sector: "IT" },
    { id: "hcltech", name: "HCL Technologies", symbol: "HCLTECH", price: 1723.40, change: -18.90, changePercent: -1.08, sector: "IT" },
];
// Indian commodity prices in ₹ (MCX)
const BASE_COMMODITIES: CommodityItem[] = [
  { id: "gold", name: "Gold", symbol: "GOLD", price: 72450, change: 380, changePercent: 0.53, unit: "₹/10g" },
  { id: "silver", name: "Silver", symbol: "SILVER", price: 85620, change: -520, changePercent: -0.60, unit: "₹/kg" },
  { id: "crudeoil", name: "Crude Oil", symbol: "CRUDEOIL", price: 6545, change: 78, changePercent: 1.21, unit: "₹/bbl" },
];
// State to maintain continuity between ticks
let currentIndices = BASE_INDICES.map((i) => ({ ...i }));
let currentGainers = BASE_GAINERS.map((i) => ({ ...i }));
let currentLosers = BASE_LOSERS.map((i) => ({ ...i }));
let currentCommodities = BASE_COMMODITIES.map((i) => ({ ...i }));
function tickItem<T extends { price: number; change: number; changePercent: number }>(item: T): T {
  const newPrice = jitter(item.price);
  const basePrice = item.price - item.change;
  const newChange = parseFloat((newPrice - basePrice).toFixed(2));
  const newPercent = parseFloat(((newChange / basePrice) * 100).toFixed(2));
  return { ...item, price: newPrice, change: newChange, changePercent: newPercent };
}
export async function fetchMarketSnapshot(): Promise<MarketSnapshot> {
  // ── Live API path (ready for integration) ──
  if (isLiveMode()) {
    // TODO: Implement provider-specific fetch logic here
  }
  // ── Simulated data ──
  const isOpen = isIndianMarketOpen();
  
  currentIndices = currentIndices.map(idx => ({
    ...tickItem(idx),
    status: idx.region === "india" ? (isOpen ? "open" as const : "closed" as const) : idx.status,
  }));
  currentGainers = currentGainers.map(tickItem);
  currentLosers = currentLosers.map(tickItem);
  currentCommodities = currentCommodities.map(tickItem);
  // Keep gainers positive, losers negative
  currentGainers = currentGainers.map((g) => ({
    ...g,
    change: Math.abs(g.change),
    changePercent: Math.abs(g.changePercent),
  }));
  currentLosers = currentLosers.map((l) => ({
    ...l,
    change: -Math.abs(l.change),
    changePercent: -Math.abs(l.changePercent),
  }));
  return {
    indices: currentIndices,
    topGainers: currentGainers.sort((a, b) => b.changePercent - a.changePercent),
    topLosers: currentLosers.sort((a, b) => a.changePercent - b.changePercent),
    commodities: currentCommodities,
    niftyChart: generateChart(24178, 30),
    sensexChart: generateChart(79842, 30),
    lastUpdated: new Date(),
  };
}
