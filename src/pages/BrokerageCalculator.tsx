import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import CalculatorLayout from "@/components/CalculatorLayout";
const fmt = (v: number) => "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 2 });
const BrokerageCalc = () => {
  const [buyPrice, setBuyPrice] = useState(500);
  const [sellPrice, setSellPrice] = useState(550);
  const [qty, setQty] = useState(100);
  const [brokerageRate, setBrokerageRate] = useState(0.03);
  const result = useMemo(() => {
    const turnover = buyPrice * qty + sellPrice * qty;
    const brokerage = Math.min(turnover * (brokerageRate / 100), 40); // flat cap ₹20 per side
    const stt = sellPrice * qty * 0.001;
    const exchangeTxn = turnover * 0.0000345;
    const gst = (brokerage + exchangeTxn) * 0.18;
    const sebi = turnover * 0.000001;
    const stampDuty = buyPrice * qty * 0.00015;
    const totalCharges = brokerage + stt + exchangeTxn + gst + sebi + stampDuty;
    const grossPL = (sellPrice - buyPrice) * qty;
    const netPL = grossPL - totalCharges;
    return { brokerage, stt, exchangeTxn, gst, sebi, stampDuty, totalCharges, grossPL, netPL, turnover };
  }, [buyPrice, sellPrice, qty, brokerageRate]);
  return (
    <div className="card-elevated p-6 sm:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Buy Price", value: buyPrice, set: setBuyPrice, min: 1, max: 50000, step: 1, prefix: "₹" },
            { label: "Sell Price", value: sellPrice, set: setSellPrice, min: 1, max: 50000, step: 1, prefix: "₹" },
            { label: "Quantity", value: qty, set: setQty, min: 1, max: 10000, step: 1, prefix: "" },
            { label: "Brokerage Rate", value: brokerageRate, set: setBrokerageRate, min: 0, max: 1, step: 0.01, prefix: "", suffix: "%" },
          ].map(({ label, value, set, min, max, step, prefix, suffix }) => (
            <div key={label}>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <div className="flex items-center gap-1">
                  {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
                  <Input type="number" value={value} onChange={e => set(Math.max(min, +e.target.value))} className="w-24 h-8 text-sm text-right" />
                  {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
                </div>
              </div>
              <Slider value={[value]} onValueChange={v => set(v[0])} min={min} max={max} step={step} />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground mb-3">Charges Breakdown</h3>
          {[
            ["Turnover", result.turnover],
            ["Brokerage", result.brokerage],
            ["STT", result.stt],
            ["Exchange Txn", result.exchangeTxn],
            ["GST", result.gst],
            ["SEBI Charges", result.sebi],
            ["Stamp Duty", result.stampDuty],
          ].map(([label, val]) => (
            <div key={label as string} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label as string}</span>
              <span className="text-foreground">{fmt(val as number)}</span>
            </div>
          ))}
          <hr className="border-border" />
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-foreground">Total Charges</span>
            <span className="text-destructive">{fmt(result.totalCharges)}</span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Gross P&L</span>
            <span className={result.grossPL >= 0 ? "text-primary font-semibold" : "text-destructive font-semibold"}>{fmt(result.grossPL)}</span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span className="text-foreground">Net P&L</span>
            <span className={result.netPL >= 0 ? "text-primary" : "text-destructive"}>{fmt(result.netPL)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
const EducationalContent = () => (
  <div className="prose prose-sm max-w-none space-y-8">
    <div className="card-elevated p-6 sm:p-8 space-y-4">
      <h2 className="text-xl font-bold text-foreground">What is a Brokerage Calculator?</h2>
      <p className="text-muted-foreground">A brokerage calculator helps you estimate the total costs involved in buying and selling stocks, including brokerage fees, taxes, and regulatory charges. It gives you a clear picture of net profit or loss after all deductions.</p>
    </div>
    <div className="card-elevated p-6 sm:p-8 space-y-4">
      <h2 className="text-xl font-bold text-foreground">How Brokerage Charges Are Calculated</h2>
      <p className="text-muted-foreground">When you execute a trade, multiple charges apply:</p>
      <ul className="text-muted-foreground space-y-1 list-disc pl-5">
        <li><strong>Brokerage:</strong> Fee charged by your broker (flat or percentage-based).</li>
        <li><strong>STT:</strong> Securities Transaction Tax levied by the government.</li>
        <li><strong>Exchange Transaction Charges:</strong> Fees by NSE/BSE for using their platform.</li>
        <li><strong>GST:</strong> 18% on brokerage and exchange transaction charges.</li>
        <li><strong>SEBI Charges:</strong> Regulatory fee charged per transaction.</li>
        <li><strong>Stamp Duty:</strong> State-level duty on buy-side transactions.</li>
      </ul>
    </div>
    <div className="card-elevated p-6 sm:p-8 space-y-4">
      <h2 className="text-xl font-bold text-foreground">Why Brokerage Calculation Matters</h2>
      <p className="text-muted-foreground">Understanding total trading costs is crucial for:</p>
      <ul className="text-muted-foreground space-y-1 list-disc pl-5">
        <li>Accurately calculating your break-even price</li>
        <li>Comparing different brokers and their fee structures</li>
        <li>Making informed decisions on trade size and frequency</li>
        <li>Avoiding surprises in your profit and loss statements</li>
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