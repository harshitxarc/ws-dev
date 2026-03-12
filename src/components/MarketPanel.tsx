import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, RefreshCw, Clock } from "lucide-react";
import { useMarketData, type MarketAsset } from "@/hooks/useMarketData";
import { Skeleton } from "@/components/ui/skeleton";
import { isIndianMarketOpen, getISTTime } from "@/lib/formatINR";

const formatPrice = (price: number, region?: "india" | "global") => {
  if (region === "global") return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  return `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
};
const AssetRow = ({ asset }: { asset: MarketAsset }) => {
  const positive = asset.change >= 0;
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted/60">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{asset.name}</span>
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {asset.category === "commodity" ? "MCX" : asset.region === "india" ? "NSE" : asset.symbol}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {asset.status === "open" ? "Market Open" : "Market Closed"}
        </p>
      </div>
      <div className="text-right">
        <motion.p
          key={asset.price}
          initial={{ opacity: 0.6, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-sm font-bold text-foreground tabular-nums"
        >
          {formatPrice(asset.price, asset.region)}
        </motion.p>
        <div className={`mt-0.5 flex items-center justify-end gap-1 text-xs font-medium ${positive ? "text-primary" : "text-destructive"}`}>
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span className="tabular-nums">{positive ? "+" : ""}{asset.change.toFixed(2)}</span>
          <span className="tabular-nums">({positive ? "+" : ""}{asset.changePercent.toFixed(2)}%)</span>
        </div>
      </div>
    </div>
  );
};
const LoadingSkeleton = () => (
  <div className="space-y-3 p-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center justify-between gap-3 px-3 py-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="space-y-2 text-right">
          <Skeleton className="ml-auto h-4 w-20" />
          <Skeleton className="ml-auto h-3 w-16" />
        </div>
      </div>
    ))}
  </div>
);
interface MarketPanelProps {
  onClose: () => void;
}
const MarketPanel = ({ onClose }: MarketPanelProps) => {
  const { data, loading, lastUpdated } = useMarketData();
  const isOpen = isIndianMarketOpen();
  const indices = data.filter((a) => a.category === "index");
  const commodities = data.filter((a) => a.category === "commodity");
  return (
    <motion.div
      role="dialog"
      aria-label="Live Market Data"
      className="fixed z-[60] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl
        bottom-24 right-6 w-[380px]
        max-[640px]:inset-x-0 max-[640px]:bottom-0 max-[640px]:right-0 max-[640px]:w-full max-[640px]:rounded-b-none max-[640px]:rounded-t-2xl"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.96 }}
      transition={{ type: "spring", damping: 26, stiffness: 340 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Live Markets</h2>
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${isOpen ? "bg-primary" : "bg-muted-foreground"} opacity-75`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${isOpen ? "bg-primary" : "bg-muted-foreground"}`} />
          </span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <RefreshCw className="h-3 w-3" />
            {lastUpdated.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })}
          </div>
          <span className={`text-[9px] font-semibold ${isOpen ? "text-primary" : "text-muted-foreground"}`}>
            {isOpen ? "Market Open" : "Market Closed"}
          </span>
        </div>
      </div>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="max-h-[420px] overflow-y-auto overscroll-contain px-2 py-2 max-[640px]:max-h-[60vh]">
          {/* Indian Indices */}
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Indian Indices</p>
          {indices.filter(a => a.region === "india").map((a) => (
            <AssetRow key={a.id} asset={a} />
          ))}

          {/* Global Indices */}
          {indices.filter(a => a.region === "global").length > 0 && (
            <>
              <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Global</p>
              {indices.filter(a => a.region === "global").map((a) => (
                <AssetRow key={a.id} asset={a} />
              ))}
            </>
          )}

          {/* Commodities */}
          <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Commodities (MCX)</p>
          {commodities.map((a) => (
            <AssetRow key={a.id} asset={a} />
          ))}
        </div>
      )}
      {/* Footer */}
      <div className="border-t border-border px-5 py-2.5 text-center text-[10px] text-muted-foreground">
        Simulated data · NSE/BSE hours: 9:15 AM – 3:30 PM IST
      </div>
    </motion.div>
  );
};
export default MarketPanel;