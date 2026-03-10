import { useState, useEffect, useCallback } from "react";
export interface MarketAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  status: "open" | "closed";
  category: "index" | "commodity";
}
const BASE_DATA: MarketAsset[] = [
  { id: "sensex", name: "SENSEX", symbol: "BSE", price: 79842.32, change: 312.45, changePercent: 0.39, status: "open", category: "index" },
  { id: "nifty", name: "NIFTY 50", symbol: "NSE", price: 24178.65, change: 98.7, changePercent: 0.41, status: "open", category: "index" },
  { id: "nasdaq", name: "NASDAQ", symbol: "IXIC", price: 19112.32, change: -45.23, changePercent: -0.24, status: "open", category: "index" },
  { id: "sp500", name: "S&P 500", symbol: "SPX", price: 5998.74, change: 22.18, changePercent: 0.37, status: "open", category: "index" },
  { id: "dowjones", name: "DOW JONES", symbol: "DJI", price: 42840.26, change: -128.91, changePercent: -0.30, status: "open", category: "index" },
  { id: "gold", name: "GOLD", symbol: "XAU", price: 2948.50, change: 18.30, changePercent: 0.62, status: "open", category: "commodity" },
  { id: "silver", name: "SILVER", symbol: "XAG", price: 33.42, change: -0.28, changePercent: -0.83, status: "open", category: "commodity" },
];
function jitter(base: number, maxPercent = 0.15): number {
  const delta = base * (maxPercent / 100) * (Math.random() * 2 - 1);
  return parseFloat((base + delta).toFixed(2));
}
export function useMarketData() {
  const [data, setData] = useState<MarketAsset[]>(BASE_DATA);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const tick = useCallback(() => {
    setData((prev) =>
      prev.map((asset) => {
        const newPrice = jitter(asset.price);
        const newChange = parseFloat((newPrice - (asset.price - asset.change)).toFixed(2));
        const newPercent = parseFloat(((newChange / (newPrice - newChange)) * 100).toFixed(2));
        return { ...asset, price: newPrice, change: newChange, changePercent: newPercent };
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