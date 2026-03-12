import { useState, useEffect, useCallback } from "react";
import { isIndianMarketOpen } from "@/lib/formatINR";

export interface MarketAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  status: "open" | "closed";
  category: "index" | "commodity";
  region?: "india" | "global";
}
const BASE_DATA: MarketAsset[] = [
  // Indian indices first
  { id: "sensex", name: "SENSEX", symbol: "BSE", price: 79842.32, change: 312.45, changePercent: 0.39, status: "open", category: "index", region: "india" },
  { id: "nifty", name: "NIFTY 50", symbol: "NSE", price: 24178.65, change: 98.7, changePercent: 0.41, status: "open", category: "index", region: "india" },
  { id: "niftybank", name: "NIFTY BANK", symbol: "NSEBANK", price: 51245.80, change: 245.30, changePercent: 0.48, status: "open", category: "index", region: "india" },
  { id: "niftymidcap", name: "NIFTY MIDCAP", symbol: "NSEMID", price: 14532.40, change: -67.20, changePercent: -0.46, status: "open", category: "index", region: "india" },
  // Global
  { id: "nasdaq", name: "NASDAQ", symbol: "IXIC", price: 19112.32, change: -45.23, changePercent: -0.24, status: "closed", category: "index", region: "global" },
  { id: "sp500", name: "S&P 500", symbol: "SPX", price: 5998.74, change: 22.18, changePercent: 0.37, status: "closed", category: "index", region: "global" },
  // Indian commodities (MCX prices in ₹)
  { id: "gold", name: "GOLD", symbol: "GOLD", price: 72450, change: 380, changePercent: 0.53, status: "open", category: "commodity", region: "india" },
  { id: "silver", name: "SILVER", symbol: "SILVER", price: 85620, change: -520, changePercent: -0.60, status: "open", category: "commodity", region: "india" },
];
function jitter(base: number, maxPercent = 0.15): number {
  const delta = base * (maxPercent / 100) * (Math.random() * 2 - 1);
  return parseFloat((base + delta).toFixed(2));
}
export function useMarketData() {
  const [data, setData] = useState<MarketAsset[]>(() =>
    BASE_DATA.map(a => ({
      ...a,
      status: a.region === "india" ? (isIndianMarketOpen() ? "open" : "closed") : a.status,
    }))
  );
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const tick = useCallback(() => {
    const isOpen = isIndianMarketOpen();
    setData((prev) =>
      prev.map((asset) => {
        const newPrice = jitter(asset.price);
        const newChange = parseFloat((newPrice - (asset.price - asset.change)).toFixed(2));
        const newPercent = parseFloat(((newChange / (newPrice - newChange)) * 100).toFixed(2));
        return {
          ...asset,
          price: newPrice,
          change: newChange,
          changePercent: newPercent,
          status: asset.region === "india" ? (isOpen ? "open" : "closed") : asset.status,
        };
      })
    );
    setLastUpdated(new Date());
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(tick, 6000);
    return () => clearInterval(interval);
  }, [loading, tick]);
  return { data, loading, lastUpdated };
}