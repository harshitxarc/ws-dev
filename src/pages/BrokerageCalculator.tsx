import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CalculatorLayout from "@/components/CalculatorLayout";
import AnimatedNumber from "@/components/AnimatedNumber";
import { TrendingUp, TrendingDown, Receipt, Lightbulb, BarChart3 } from "lucide-react";

const fmt = (v: number) => "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 2 });
const pctFmt = (v: number) => v.toFixed(4) + "%";

type Segment = "equity_delivery" | "equity_intraday" | "fno_futures" | "fno_options";

const SEGMENT_CONFIG: Record<
  Segment,
  { label: string; sttBuy: number; sttSell: number; exchangeRate: number; stampBuy: number; brokerageFlat: number | null }
> = {
  equity_delivery: { label: "Equity Delivery", sttBuy: 0.001, sttSell: 0.001, exchangeRate: 0.0000345, stampBuy: 0.00015, brokerageFlat: null },
  equity_intraday: { label: "Equity Intraday", sttBuy: 0, sttSell: 0.00025, exchangeRate: 0.0000345, stampBuy: 0.00003, brokerageFlat: null },
  fno_futures: { label: "F&O Futures", sttBuy: 0, sttSell: 0.000125, exchangeRate: 0.0000019, stampBuy: 0.00002, brokerageFlat: 20 },
  fno_options: { label: "F&O Options", sttBuy: 0, sttSell: 0.000625, exchangeRate: 0.0000053, stampBuy: 0.00003, brokerageFlat: 20 },
};

const BrokerageCalc = () => {
  const [segment, setSegment] = useState<Segment>("equity_delivery");
  const [buyPrice, setBuyPrice] = useState(500);
  const [sellPrice, setSellPrice] = useState(550);
  const [qty, setQty] = useState(100);
  const [brokerageRate, setBrokerageRate] = useState(0.03);

  const cfg = SEGMENT_CONFIG[segment];

  const result = useMemo(() => {
    const buyValue = buyPrice * qty;
    const sellValue = sellPrice * qty;
    const turnover = buyValue + sellValue;

    let brokerage: number;
    if (cfg.brokerageFlat !== null) {
      brokerage = cfg.brokerageFlat * 2; // buy + sell
    } else {
      brokerage = Math.min(turnover * (brokerageRate / 100), 40); // ₹20 per order max (buy+sell)
    }

    const stt = buyValue * cfg.sttBuy + sellValue * cfg.sttSell;
    const exchangeTxn = turnover * cfg.exchangeRate;
    const gst = (brokerage + exchangeTxn) * 0.18;
    const sebi = turnover * 0.000001;
    const stampDuty = buyValue * cfg.stampBuy;
    const dpCharges = segment === "equity_delivery" ? 15.93 : 0;

    const totalCharges = brokerage + stt + exchangeTxn + gst + sebi + stampDuty + dpCharges;
    const grossPL = (sellPrice - buyPrice) * qty;
    const netPL = grossPL - totalCharges;

    const chargesAsPct = turnover > 0 ? (totalCharges / turnover) * 100 : 0;

    return {
      brokerage,
      stt,
      exchangeTxn,
      gst,
      sebi,
      stampDuty,
      dpCharges,
      totalCharges,
      grossPL,
      netPL,
      turnover,
      buyValue,
      sellValue,
      chargesAsPct,
    };
  }, [buyPrice, sellPrice, qty, brokerageRate, cfg, segment]);

  const isProfit = result.netPL >= 0;

  const controls = [
    { label: "Buy Price", value: buyPrice, set: setBuyPrice, min: 1, max: 50000, step: 1, prefix: "₹" },
    { label: "Sell Price", value: sellPrice, set: setSellPrice, min: 1, max: 50000, step: 1, prefix: "₹" },
    { label: "Quantity", value: qty, set: setQty, min: 1, max: 10000, step: 1 },
  ];

  const breakdown = [
    ["Turnover", result.turnover],
    ["Brokerage", result.brokerage],
    ["STT", result.stt],
    ["Exchange Txn Charges", result.exchangeTxn],
    ["GST (18%)", result.gst],
    ["SEBI Charges", result.sebi],
    ["Stamp Duty", result.stampDuty],
    ...(segment === "equity_delivery" ? [["DP Charges", result.dpCharges]] : []),
  ];

  return (
    <div className="space-y-6">
      <div className="card-elevated p-6 sm:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Trade Segment</label>
              <Select value={segment} onValueChange={v => setSegment(v as Segment)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SEGMENT_CONFIG).map(([key, val]) => (
                    <SelectItem key={key} value={key}>
                      {val.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {controls.map(({ label, value, set, min, max, step, prefix }) => (
              <div key={label}>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">{label}</label>
                  <div className="flex items-center gap-1">
                    {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
                    <Input
                      type="number"
                      value={value}
                      onChange={e => set(Math.max(min, +e.target.value))}
                      className="w-28 h-8 text-sm text-right"
                    />
                  </div>
                </div>
                <Slider value={[value]} onValueChange={v => set(v[0])} min={min} max={max} step={step} />
              </div>
            ))}

            {cfg.brokerageFlat === null && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Brokerage Rate</label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={brokerageRate}
                      onChange={e => setBrokerageRate(Math.max(0, +e.target.value))}
                      className="w-20 h-8 text-sm text-right"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <Slider value={[brokerageRate]} onValueChange={v => setBrokerageRate(v[0])} min={0} max={1} step={0.01} />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Charges Breakdown</h3>
            {breakdown.map(([label, val]) => (
              <div key={label as string} className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground">{label as string}</span>
                <span className="text-foreground font-medium">{fmt(val as number)}</span>
              </div>
            ))}
            <hr className="border-border" />
            <div className="flex justify-between text-sm font-bold pt-1">
              <span className="text-foreground">Total Charges</span>
              <span className="text-destructive">{fmt(result.totalCharges)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Charges represent {pctFmt(result.chargesAsPct)} of turnover</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="card-elevated p-4 flex flex-col gap-1 !transform-none">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">Turnover</span>
          </div>
          <AnimatedNumber value={result.turnover} format={fmt} className="text-lg font-bold text-foreground" />
        </div>
        <div className="card-elevated p-4 flex flex-col gap-1 !transform-none">
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">Total Charges</span>
          </div>
          <AnimatedNumber value={result.totalCharges} format={fmt} className="text-lg font-bold text-destructive" />
        </div>
        <div className="card-elevated p-4 flex flex-col gap-1 !transform-none">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">Gross P&L</span>
          </div>
          <AnimatedNumber
            value={result.grossPL}
            format={fmt}
            className={`text-lg font-bold ${result.grossPL >= 0 ? "text-primary" : "text-destructive"}`}
          />
        </div>
        <div className="card-elevated p-4 flex flex-col gap-1 !transform-none">
          <div className="flex items-center gap-2 mb-1">
            {isProfit ? <TrendingUp className="w-4 h-4 text-primary" /> : <TrendingDown className="w-4 h-4 text-destructive" />}
            <span className="text-xs text-muted-foreground font-medium">Net P&L</span>
          </div>
          <AnimatedNumber value={result.netPL} format={fmt} className={`text-lg font-bold ${isProfit ? "text-primary" : "text-destructive"}`} />
        </div>
      </div>

      <div className="card-elevated p-5 flex items-start gap-3 border-primary/20 !transform-none">
        <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Breakeven Tip:</span> Your breakeven sell price (after all charges) is approximately{" "}
          <span className="font-semibold text-primary">{fmt(buyPrice + result.totalCharges / qty)}</span> per share.{" "}
          {segment !== "equity_delivery" && "Consider delivery trades for lower STT on both sides."}
        </p>
      </div>
    </div>
  );
};

const EducationalContent = () => (
  <div className="prose prose-sm max-w-none space-y-6">
    <div className="card-elevated p-6 sm:p-8 space-y-3 !transform-none">
      <h2 className="text-lg font-bold text-foreground">What is a Brokerage Calculator?</h2>
      <p className="text-muted-foreground">
        A brokerage calculator helps you estimate the total costs involved in buying and selling stocks, including brokerage fees, taxes, and regulatory charges across different trading segments.
      </p>
    </div>

    <div className="card-elevated p-6 sm:p-8 space-y-3 !transform-none">
      <h2 className="text-lg font-bold text-foreground">Trading Segments Explained</h2>
      <ul className="text-muted-foreground space-y-2 list-disc pl-5">
        <li><strong>Equity Delivery:</strong> Buy and hold stocks — STT applies on both buy and sell sides.</li>
        <li><strong>Equity Intraday:</strong> Buy and sell same day — lower STT (sell-side only), but higher risk.</li>
        <li><strong>F&O Futures:</strong> Futures contracts with flat brokerage and lower exchange charges.</li>
        <li><strong>F&O Options:</strong> Options trading with STT on sell premium value.</li>
      </ul>
    </div>

    <div className="card-elevated p-6 sm:p-8 space-y-3 !transform-none">
      <h2 className="text-lg font-bold text-foreground">Charge Components</h2>
      <ul className="text-muted-foreground space-y-1 list-disc pl-5">
        <li><strong>Brokerage:</strong> Fee charged by your broker (flat or percentage-based).</li>
        <li><strong>STT:</strong> Securities Transaction Tax levied by the government.</li>
        <li><strong>Exchange Charges:</strong> Fees by NSE/BSE for using the exchange.</li>
        <li><strong>GST:</strong> 18% on brokerage and exchange charges.</li>
        <li><strong>SEBI Charges:</strong> Regulatory fee of ₹10 per crore.</li>
        <li><strong>Stamp Duty:</strong> State-level duty on buy-side transactions.</li>
        <li><strong>DP Charges:</strong> Depository participant charges for delivery trades (₹15.93).</li>
      </ul>
    </div>
  </div>
);

const BrokerageCalculator = () => (
  <CalculatorLayout
    title="Brokerage Calculator"
    description="Estimate charges for your trades and investments, including all fees and taxes."
    calculator={<BrokerageCalc />}
    educationalContent={<EducationalContent />}
  />
);

export default BrokerageCalculator;
