import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Activity, RefreshCw, BarChart3, Droplets,
  Gem, Flame, ArrowUpRight, ArrowDownRight, AlertCircle, Loader2, Clock
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useDashboardData } from "@/hooks/useDashboardData";
import { isLiveMode } from "@/services/marketDataService";
import type { MarketIndex, StockItem, CommodityItem, ChartPoint } from "@/services/marketDataService";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { isIndianMarketOpen, getISTTime } from "@/lib/formatINR";
// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatPrice = (price: number, region?: "india" | "global") => {
  if (region === "global") return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  return `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const MarketStatusBadge = () => {
  const isOpen = isIndianMarketOpen();
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${isOpen ? "bg-primary" : "bg-muted-foreground"} opacity-75`} />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${isOpen ? "bg-primary" : "bg-muted-foreground"}`} />
      </span>
      <span className={`font-semibold ${isOpen ? "text-primary" : "text-muted-foreground"}`}>
        {isOpen ? "Market Open" : "Market Closed"}
      </span>
      <span className="text-muted-foreground">• NSE/BSE 9:15 AM – 3:30 PM IST</span>
    </div>
  );
};
const IndexCard = ({ item }: { item: MarketIndex }) => {
  const positive = item.change >= 0;
  return (
    <motion.div
      className="card-elevated p-4 sm:p-5 group"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{item.name}</p>
            <p className="text-[10px] text-muted-foreground">{item.region === "india" ? "NSE/BSE" : item.symbol}</p>
          </div>
        </div>
        <span className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${item.status === "open" ? "bg-primary" : "bg-muted-foreground"} opacity-75`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${item.status === "open" ? "bg-primary" : "bg-muted-foreground"}`} />
        </span>
      </div>
      <p className="text-xl font-extrabold text-foreground tabular-nums">
        {formatPrice(item.price, item.region)}
      </p>
      <div className={`mt-1 flex items-center gap-1.5 text-sm font-semibold ${positive ? "text-primary" : "text-destructive"}`}>
        {positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        <span className="tabular-nums">{positive ? "+" : ""}{item.change.toFixed(2)}</span>
        <span className="text-xs tabular-nums">({positive ? "+" : ""}{item.changePercent.toFixed(2)}%)</span>
      </div>
    </motion.div>
  );
};
const StockRow = ({ item, rank }: { item: StockItem; rank: number }) => {
  const positive = item.change >= 0;
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-muted/50">
      <span className="text-xs font-bold text-muted-foreground w-5 text-center">{rank}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{item.symbol}</span>
          {item.sector && (
            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{item.sector}</span>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-foreground tabular-nums">₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
        <p className={`text-xs font-semibold tabular-nums ${positive ? "text-primary" : "text-destructive"}`}>
          {positive ? "+" : ""}{item.change.toFixed(2)} ({positive ? "+" : ""}{item.changePercent.toFixed(2)}%)
        </p>
      </div>
    </div>
  );
};
const commodityIcon = (symbol: string) => {
  switch (symbol) {
    case "GOLD": return Gem;
    case "SILVER": return Droplets;
    case "CRUDEOIL": return Flame;
    default: return Activity;
  }
};
const CommodityCard = ({ item }: { item: CommodityItem }) => {
  const positive = item.change >= 0;
  const Icon = commodityIcon(item.symbol);
  return (
    <motion.div className="card-elevated p-4 sm:p-5" whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{item.name}</p>
          <p className="text-[10px] text-muted-foreground">{item.unit}</p>
        </div>
      </div>
      <p className="text-lg font-extrabold text-foreground tabular-nums">₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
      <div className={`mt-1 flex items-center gap-1 text-xs font-semibold ${positive ? "text-primary" : "text-destructive"}`}>
        {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        <span className="tabular-nums">{positive ? "+" : ""}{item.change.toFixed(2)} ({positive ? "+" : ""}{item.changePercent.toFixed(2)}%)</span>
      </div>
    </motion.div>
  );
};
const MiniChart = ({ data, label, color }: { data: ChartPoint[]; label: string; color: string }) => (
  <div className="card-elevated p-4 sm:p-5">
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm font-bold text-foreground">{label}</p>
      <span className="text-[10px] text-muted-foreground">Intraday (IST)</span>
    </div>
    <div className="h-48 sm:h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(210 10% 46%)" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.75rem",
              fontSize: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            labelStyle={{ fontWeight: 600 }}
            formatter={(value: number) => [`₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, label]}
          />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${label})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);
const LoadingGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="card-elevated p-5 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-24" />
      </div>
    ))}
  </div>
);
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="card-elevated p-8 text-center max-w-md mx-auto">
    <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
    <p className="text-sm text-muted-foreground mb-4">{message}</p>
    <button onClick={onRetry} className="btn-primary-glow !py-2 !px-5 text-sm">
      Retry
    </button>
  </div>
);
// ─── Main Page ───────────────────────────────────────────────────────────────
const MarketDashboard = () => {
  const { data, loading, error, refetch } = useDashboardData();

  const indianIndices = data?.indices.filter(i => i.region === "india") ?? [];
  const globalIndices = data?.indices.filter(i => i.region === "global") ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero */}
      <section className="relative pt-28 sm:pt-36 pb-10 sm:pb-14 overflow-hidden">
        <div className="absolute inset-0 hero-gradient-bg" />
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="container-narrow section-padding !py-0 relative z-10">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4"
            >
              <Activity className="w-3.5 h-3.5" />
              {isLiveMode() ? "Live Data" : "Simulated Data"}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-3"
            >
              Indian Market <span className="gradient-text">Dashboard</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              Track real-time movements across NSE, BSE indices, Indian equities, and MCX commodities — all priced in ₹.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 space-y-2"
            >
              <MarketStatusBadge />
              {data && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <RefreshCw className="w-3 h-3" />
                  Last updated: {data.lastUpdated.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })} IST
                  {!isLiveMode() && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium">
                      Demo Mode — Add API key for live data
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
      <div className="container-narrow section-padding !pt-4">
        {error && !data ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : loading ? (
          <div className="space-y-8">
            <LoadingGrid />
          </div>
        ) : data ? (
          <div className="space-y-8">
            {/* Market Indices */}
            <ScrollReveal>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Market Overview</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {indianIndices.map((idx) => (
                  <IndexCard key={idx.id} item={idx} />
                ))}
              </div>
            </ScrollReveal>
            {/* Charts */}
            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <MiniChart data={data.niftyChart} label="NIFTY 50" color="hsl(162, 63%, 41%)" />
                <MiniChart data={data.sensexChart} label="SENSEX" color="hsl(200, 70%, 50%)" />
              </div>
            </ScrollReveal>
            {/* Gainers & Losers */}
            <ScrollReveal delay={0.15}>
              <Tabs defaultValue="gainers" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="gainers" className="gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" /> Top Gainers
                  </TabsTrigger>
                  <TabsTrigger value="losers" className="gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5" /> Top Losers
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="gainers">
                  <div className="card-elevated divide-y divide-border">
                    {data.topGainers.map((stock, i) => (
                      <StockRow key={stock.id} item={stock} rank={i + 1} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="losers">
                  <div className="card-elevated divide-y divide-border">
                    {data.topLosers.map((stock, i) => (
                      <StockRow key={stock.id} item={stock} rank={i + 1} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </ScrollReveal>

            {/* Global Indices */}
            {globalIndices.length > 0 && (
              <ScrollReveal delay={0.18}>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-muted-foreground" />
                  <h2 className="text-lg font-bold text-foreground">Global Markets</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {globalIndices.map((idx) => (
                    <IndexCard key={idx.id} item={idx} />
                  ))}
                </div>
              </ScrollReveal>
            )}

            {/* Commodities */}
            <ScrollReveal delay={0.2}>
              <div className="flex items-center gap-2 mb-4">
                <Gem className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Commodities (MCX)</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.commodities.map((c) => (
                  <CommodityCard key={c.id} item={c} />
                ))}
              </div>
            </ScrollReveal>
            {/* API Setup Guide */}
            {!isLiveMode() && (
              <ScrollReveal delay={0.25}>
                <div className="card-elevated p-6 sm:p-8 border-dashed">
                  <h3 className="text-base font-bold text-foreground mb-2">🔌 Connect Live Data</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    This dashboard is running with simulated data. To enable live Indian market data, set these environment variables:
                  </p>
                  <div className="bg-muted rounded-xl p-4 font-mono text-xs text-foreground space-y-1">
                    <p>VITE_MARKET_API_PROVIDER=finnhub</p>
                    <p>VITE_MARKET_API_KEY=your_api_key_here</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Supported providers: Finnhub, Alpha Vantage, Twelve Data, Polygon.io
                  </p>
                </div>
              </ScrollReveal>
            )}
          </div>
        ) : null}
      </div>
      <Footer />
    </div>
  );
};
export default MarketDashboard;