import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import CalculatorLayout from "@/components/CalculatorLayout";
const formatCurrency = (val: number) =>
  "₹" + val.toLocaleString("en-IN", { maximumFractionDigits: 0 });
const SIPCalc = () => {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const result = useMemo(() => {
    const n = years * 12;
    const r = rate / 100 / 12;
    const invested = monthly * n;
    const total = r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : invested;
    return { invested, total: Math.round(total), returns: Math.round(total - invested) };
  }, [monthly, rate, years]);
  const chartData = [
    { name: "Invested", value: result.invested },
    { name: "Returns", value: result.returns },
  ];
  return (
    <div className="card-elevated p-6 sm:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Monthly Investment</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">₹</span>
                <Input type="number" value={monthly} onChange={e => setMonthly(Math.max(500, +e.target.value))} className="w-24 h-8 text-sm text-right" />
              </div>
            </div>
            <Slider value={[monthly]} onValueChange={v => setMonthly(v[0])} min={500} max={200000} step={500} />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Expected Return Rate (p.a.)</label>
              <div className="flex items-center gap-1">
                <Input type="number" value={rate} onChange={e => setRate(Math.min(30, Math.max(1, +e.target.value)))} className="w-16 h-8 text-sm text-right" />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <Slider value={[rate]} onValueChange={v => setRate(v[0])} min={1} max={30} step={0.5} />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Time Period</label>
              <div className="flex items-center gap-1">
                <Input type="number" value={years} onChange={e => setYears(Math.min(40, Math.max(1, +e.target.value)))} className="w-16 h-8 text-sm text-right" />
                <span className="text-sm text-muted-foreground">Yrs</span>
              </div>
            </div>
            <Slider value={[years]} onValueChange={v => setYears(v[0])} min={1} max={40} step={1} />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="w-48 h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                  <Cell fill="hsl(162, 63%, 41%)" />
                  <Cell fill="hsl(210, 20%, 92%)" />
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Invested Amount</span><span className="font-semibold text-foreground">{formatCurrency(result.invested)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Est. Returns</span><span className="font-semibold text-primary">{formatCurrency(result.returns)}</span></div>
            <hr className="border-border" />
            <div className="flex justify-between"><span className="font-medium text-foreground">Total Value</span><span className="font-bold text-foreground text-base">{formatCurrency(result.total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
const EducationalContent = () => (
  <div className="prose prose-sm max-w-none space-y-8">
    <div className="card-elevated p-6 sm:p-8 space-y-4">
      <h2 className="text-xl font-bold text-foreground">What is a SIP Calculator?</h2>
      <p className="text-muted-foreground">A SIP (Systematic Investment Plan) calculator helps you estimate the potential returns on your mutual fund investments made through regular monthly contributions. It uses the power of compounding to project your wealth growth over time.</p>
    </div>
    <div className="card-elevated p-6 sm:p-8 space-y-4">
      <h2 className="text-xl font-bold text-foreground">How Does a SIP Calculator Work?</h2>
      <p className="text-muted-foreground">The calculator uses the compound interest formula for recurring investments:</p>
      <p className="text-muted-foreground font-mono text-xs bg-muted p-3 rounded-lg">FV = P × [(1+r)^n − 1] / r × (1+r)</p>
      <ul className="text-muted-foreground space-y-1 list-disc pl-5">
        <li><strong>P</strong> = Monthly investment amount</li>
        <li><strong>r</strong> = Monthly rate of return (annual rate / 12)</li>
        <li><strong>n</strong> = Total number of payments (years × 12)</li>
      </ul>
    </div>
    <div className="card-elevated p-6 sm:p-8 space-y-4">
      <h2 className="text-xl font-bold text-foreground">Benefits of Investing Through SIP</h2>
      <ul className="text-muted-foreground space-y-2 list-disc pl-5">
        <li><strong>Rupee Cost Averaging:</strong> You buy more units when prices are low and fewer when prices are high, averaging your cost.</li>
        <li><strong>Power of Compounding:</strong> Your returns earn returns, accelerating wealth creation over time.</li>
        <li><strong>Disciplined Investing:</strong> Regular automated investments build a savings habit.</li>
        <li><strong>Flexibility:</strong> Start with as little as ₹500/month and increase as your income grows.</li>
        <li><strong>No Market Timing:</strong> Removes the guesswork of when to invest.</li>
      </ul>
    </div>
    <div className="card-elevated p-6 sm:p-8 space-y-4">
      <h2 className="text-xl font-bold text-foreground">Example: SIP Investment Growth</h2>
      <p className="text-muted-foreground">If you invest ₹10,000 per month for 20 years at an expected annual return of 12%:</p>
      <ul className="text-muted-foreground space-y-1 list-disc pl-5">
        <li>Total Invested: ₹24,00,000</li>
        <li>Estimated Returns: ₹75,91,479</li>
        <li>Total Corpus: ₹99,91,479</li>
      </ul>
      <p className="text-muted-foreground">This shows how consistent SIP investing can help build significant wealth over the long term.</p>
    </div>
  </div>
);
const SIPCalculator = () => (
  <CalculatorLayout
    title="SIP Calculator"
    description="Estimate returns on your Systematic Investment Plan and plan your financial future."
    calculator={<SIPCalc />}
    educationalContent={<EducationalContent />}
  />
);
export default SIPCalculator;