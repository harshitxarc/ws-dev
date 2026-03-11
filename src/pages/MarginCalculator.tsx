import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import CalculatorLayout from "@/components/CalculatorLayout";
import AnimatedNumber from "@/components/AnimatedNumber";
import { BarChart3, Shield, TrendingUp, Lightbulb, AlertTriangle } from "lucide-react";

const fmt = (v: number) => "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const MarginCalc = () => {
  const [price, setPrice] = useState(1500);
  const [qty, setQty] = useState(100);
  const [marginReq, setMarginReq] = useState(25);
  const [availableFunds, setAvailableFunds] = useState(50000);

  const result = useMemo(() => {
    const totalValue = price * qty;
    const requiredMargin = totalValue * (marginReq / 100);
    const shortfall = Math.max(0, requiredMargin - availableFunds);
    const leverage = marginReq > 0 ? 100 / marginReq : 0;
    const surplus = Math.max(0, availableFunds - requiredMargin);
    const utilizationPct = availableFunds > 0 ? Math.min(100, (requiredMargin / availableFunds) * 100) : 100;
    let riskLevel: "low" | "medium" | "high" = "low";
    if (utilizationPct > 80) riskLevel = "high";
    else if (utilizationPct > 50) riskLevel = "medium";
    const maxQty = marginReq > 0 ? Math.floor(availableFunds / (price * marginReq / 100)) : 0;
    return { totalValue, requiredMargin, shortfall, leverage, surplus, utilizationPct, riskLevel, maxQty };
  }, [price, qty, marginReq, availableFunds]);

  const hasShortfall = result.shortfall > 0;
  const riskColors = { low: "text-primary", medium: "text-yellow-500", high: "text-destructive" };
  const riskBg = { low: "bg-primary", medium: "bg-yellow-500", high: "bg-destructive" };

  const controls = [
    { label: "Stock Price", value: price, set: setPrice, min: 1, max: 50000, step: 1, prefix: "₹" },
    { label: "Quantity", value: qty, set: setQty, min: 1, max: 10000, step: 1 },
    { label: "Margin Requirement", value: marginReq, set: setMarginReq, min: 1, max: 100, step: 1, suffix: "%" },
    { label: "Available Funds", value: availableFunds, set: setAvailableFunds, min: 0, max: 5000000, step: 1000, prefix: "₹" },
  ];

  return (
    <div className="space-y-6">
      <div className="card-elevated p-6 sm:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            {controls.map(({ label, value, set, min, max, step, prefix, suffix }) => (
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
                    {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
                  </div>
                </div>
                <Slider value={[value]} onValueChange={v => set(v[0])} min={min} max={max} step={step} />
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Margin Utilization</span>
                <span className={riskColors[result.riskLevel]}>{Math.round(result.utilizationPct)}%</span>
              </div>
              <div className="h-4 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${riskBg[result.riskLevel]}`}
                  style={{ width: `${result.utilizationPct}%` }}
                />
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                {result.riskLevel === "high" && <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
                <span className={`text-xs font-medium capitalize ${riskColors[result.riskLevel]}`}>
                  {result.riskLevel} risk
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border border-border text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max affordable qty</span>
                <span className="font-semibold text-foreground">{result.maxQty.toLocaleString("en-IN")} shares</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Leverage</span>
                <span className="font-semibold text-primary">{result.leverage.toFixed(1)}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="card-elevated p-4 flex flex-col gap-1 !transform-none">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">Trade Value</span>
          </div>
          <AnimatedNumber value={result.totalValue} format={fmt} className="text-lg font-bold text-foreground" />
        </div>
        <div className="card-elevated p-4 flex flex-col gap-1 !transform-none">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">Required Margin</span>
          </div>
          <AnimatedNumber value={result.requiredMargin} format={fmt} className="text-lg font-bold text-foreground" />
        </div>
        <div className="card-elevated p-4 flex flex-col gap-1 !transform-none">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">Leverage</span>
          </div>
          <span className="text-lg font-bold text-primary">{result.leverage.toFixed(1)}x</span>
        </div>
        <div className="card-elevated p-4 flex flex-col gap-1 !transform-none">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-4 h-4 rounded-full ${hasShortfall ? "bg-destructive" : "bg-primary"} inline-block`} />
            <span className="text-xs text-muted-foreground font-medium">{hasShortfall ? "Shortfall" : "Surplus"}</span>
          </div>
          <AnimatedNumber
            value={hasShortfall ? result.shortfall : result.surplus}
            format={fmt}
            className={`text-lg font-bold ${hasShortfall ? "text-destructive" : "text-primary"}`}
          />
        </div>
      </div>

      <div className={`card-elevated p-5 flex items-start gap-3 !transform-none ${hasShortfall ? "border-destructive/20" : "border-primary/20"}`}>
        <Lightbulb className={`w-5 h-5 shrink-0 mt-0.5 ${hasShortfall ? "text-destructive" : "text-primary"}`} />
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{hasShortfall ? "Funding Required:" : "Leverage Insight:"}</span>{" "}
          {hasShortfall
            ? `You need an additional ${fmt(result.shortfall)} to place this trade. Reduce quantity to ${result.maxQty} shares to trade within your available funds.`
            : `With ${marginReq}% margin, you control ${fmt(result.totalValue)} worth of stock using only ${fmt(result.requiredMargin)}. You can buy up to ${result.maxQty} shares with your current funds.`}
        </p>
      </div>
    </div>
  );
};

const EducationalContent = () => (
  <div className="prose prose-sm max-w-none space-y-6">
    <div className="card-elevated p-6 sm:p-8 space-y-3 !transform-none">
      <h2 className="text-lg font-bold text-foreground">What is a Margin Calculator?</h2>
      <p className="text-muted-foreground">
        A margin calculator helps you determine how much capital you need to open a leveraged trading position based on the stock price, quantity, and margin percentage required by the exchange/broker.
      </p>
    </div>
    <div className="card-elevated p-6 sm:p-8 space-y-3 !transform-none">
      <h2 className="text-lg font-bold text-foreground">Understanding Margin & Leverage</h2>
      <ul className="text-muted-foreground space-y-2 list-disc pl-5">
        <li><strong>20% margin = 5x leverage:</strong> You control ₹5 worth of stock for every ₹1 of capital.</li>
        <li><strong>Higher leverage = higher risk:</strong> A 10% drop on 5x leverage wipes out 50% of your margin.</li>
        <li><strong>SPAN + Exposure:</strong> Exchanges require SPAN margin for risk + exposure margin as buffer.</li>
      </ul>
    </div>

    <div className="card-elevated p-6 sm:p-8 space-y-3 !transform-none">
      <h2 className="text-lg font-bold text-foreground">Risks of Margin Trading</h2>
      <ul className="text-muted-foreground space-y-2 list-disc pl-5">
        <li><strong>Amplified Losses:</strong> Leverage amplifies both gains and losses equally.</li>
        <li><strong>Margin Calls:</strong> You may need to deposit additional funds if positions move against you.</li>
        <li><strong>Interest Costs:</strong> Borrowed funds incur interest charges.</li>
        <li><strong>Forced Liquidation:</strong> Brokers may sell positions if margin calls aren't met.</li>
      </ul>
    </div>
  </div>
);

const MarginCalculator = () => (
  <CalculatorLayout
    title="Margin Calculator"
    description="Estimate margin requirements, leverage, and risk based on your trade size."
    calculator={<MarginCalc />}
    educationalContent={<EducationalContent />}
  />
);

export default MarginCalculator;
