import { useState, useEffect, useCallback, useRef } from "react";
import { fetchMarketSnapshot, isLiveMode, type MarketSnapshot } from "@/services/marketDataService";
interface UseDashboardDataOptions {
  /** Polling interval in ms (default 6000 for simulated, 10000 for live) */
  interval?: number;
}
export function useDashboardData(options?: UseDashboardDataOptions) {
  const [data, setData] = useState<MarketSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCount = useRef(0);
  const maxRetries = 3;
  const defaultInterval = isLiveMode() ? 10000 : 6000;
  const interval = options?.interval ?? defaultInterval;
  const fetchData = useCallback(async () => {
    try {
      const snapshot = await fetchMarketSnapshot();
      setData(snapshot);
      setError(null);
      retryCount.current = 0;
    } catch (err) {
      retryCount.current += 1;
      if (retryCount.current >= maxRetries) {
        setError("Unable to fetch market data. Please try again later.");
      }
      console.error("Market data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, interval);
    return () => clearInterval(id);
  }, [fetchData, interval]);
  return { data, loading, error, refetch: fetchData };
}
