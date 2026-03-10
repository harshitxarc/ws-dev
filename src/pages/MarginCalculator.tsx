import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import CalculatorLayout from "@/components/CalculatorLayout";
const fmt = (v: number) => "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 2 });
const MarginCalc = () => {
  const [price, setPrice] = useState(1500);
  const [qty, setQty] = useState(100);
  const [marginReq, setMarginReq] = useState(20);
  const [availableFunds, setAvailableFunds] = useState(50000);
  const result = useMemo(() => {
    const totalValue = price * qty;
    const requiredMargin = totalValue * (marginReq / 100);
    const shortfall = Math.max(0, requiredMargin - availableFunds);
    const leverage = marginReq > 0 ? (100 / marginReq).toFixed(1) : "N/A";
    return { totalValue, requiredMargin, shortfall, leverage, surplus: Math.max(0, availableFunds - requiredMargin) };
  }, [price, qty, marginReq, availableFunds]);
  return (
    <div className="card-elevated p-6 sm:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Stock Price", value: price, set: setPrice, min: 1, max: 50000, step: 1, prefix: "₹" },
            { label: "Quantity", value: qty, set: setQty, min: 1, max: 10000, step: 1 },
            { label: "Margin Requirement", value: marginReq, set: setMarginReq, min: 1, max: 100, step: 1, suffix: "%" },
            { label: "Available Funds", value: availableFunds, set: setAvailableFunds, min: 0, max: 5000000, step: 1000, prefix: "₹" },
          ].map(({ label, value, set, min, max, step, prefix, suffix }) => (
            <div key={label}>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <div className="flex items-center gap-1">
                  {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
                  <Input type="number" value={value} onChange={e => set(Math.max(min, +e.target.value))} className="w-28 h-8 text-sm text-right" />
                  {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
                </div>
              </div>
              <Slider value={[value]} onValueChange={v => set(v[0])} min={min} max={max} step={step} />
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center space-y-3">
          {[
            ["Total Trade Value", fmt(result.totalValue)],
            ["Required Margin", fmt(result.requiredMargin)],
            ["Leverage", `${result.leverage}x`],
            ["Available Funds", fmt(availableFunds)],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="text-foreground font-medium">{val}</span>
            </div>
          ))}
          <hr className="border-border" />
          {result.shortfall > 0 ? (
            <div className="flex justify-between text-sm font-bold">
              <span className="text-destructive">Additional Funds Needed</span>
              <span className="text-destructive">{fmt(result.shortfall)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-sm font-bold">
              <span className="text-primary">Surplus Funds</span>
              <span className="text-primary">{fmt(result.surplus)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const EducationalContent = () => (
  <div className="prose prose-sm max-w-none space-y-8">
    <div className="card-elevated p-6 sm:p-8 space-y-4">
      <h2 className="text-xl font-bold text-foreground">What is a Margin Calculator?</h2>
      <p className="text-muted-foreground">A margin calculator helps you determine how much capital you need to open a leveraged trading position. It calculates the required margin based on the stock price, quantity, and the broker's margin percentage.</p>
    </div>
    <div className="card-elevated p-6 sm:p-8 space-y-4">
      <h2 className="text-xl font-bold text-foreground">How Margin Trading Works</h2>
      <p className="text-muted-foreground">Margin trading allows you to buy stocks by paying only a fraction of the total trade value. Your broker lends you the remaining amount. For example, with a 20% margin requirement, you only need ₹20,000 to take a ₹1,00,000 position — giving you 5x leverage.</p>
    </div>
    <div className="card-elevated p-6 sm:p-8 space-y-4">
      <h2 className="text-xl font-bold text-foreground">Risks of Margin Trading</h2>
      <ul className="text-muted-foreground space-y-2 list-disc pl-5">
        <li><strong>Amplified Losses:</strong> Just as leverage amplifies gains, it equally amplifies losses.</li>
        <li><strong>Margin Calls:</strong> If the stock moves against you, you may need to deposit additional funds quickly.</li>
        <li><strong>Interest Costs:</strong> Borrowed funds incur interest charges, eating into your returns.</li>
        <li><strong>Forced Liquidation:</strong> If you fail to meet a margin call, your broker may sell your position at a loss.</li>
      </ul>
    </div>
  </div>
);
const MarginCalculator = () => (
  <CalculatorLayout
    title="Margin Calculator"
    description="Estimate the balance needed to buy or sell stocks with leverage."
    calculator={<MarginCalc />}
    educationalContent={<EducationalContent />}
  />
);
export default MarginCalculator;