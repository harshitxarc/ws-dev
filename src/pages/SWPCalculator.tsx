import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import CalculatorLayout from "@/components/CalculatorLayout";
const fmt = (v: number) => "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 0 });
const SWPCalc = () => {
  const [initial, setInitial] = useState(2500000);
  const [withdrawal, setWithdrawal] = useState(25000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(15);
  const { totalWithdrawn, finalBalance, chartData } = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    let balance = initial;
    const data = [{ month: 0, year: "Start", balance: initial }];
    let withdrawn = 0;
    for (let m = 1; m <= months; m++) {
      balance = balance * (1 + monthlyRate) - withdrawal;
      withdrawn += withdrawal;
      if (balance < 0) { balance = 0; withdrawn -= withdrawal; withdrawn += balance + withdrawal; }
      if (m % 12 === 0 || m === months) {
        data.push({ month: m, year: `Yr ${Math.ceil(m / 12)}`, balance: Math.max(0, Math.round(balance)) });
      }
      if (balance <= 0) break;
    }
    return { totalWithdrawn: Math.round(withdrawn), finalBalance: Math.max(0, Math.round(balance)), chartData: data };
  }, [initial, withdrawal, rate, years]);
  return (
    <div className="card-elevated p-6 sm:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Initial Investment", value: initial, set: setInitial, min: 100000, max: 50000000, step: 50000, prefix: "₹" },
            { label: "Monthly Withdrawal", value: withdrawal, set: setWithdrawal, min: 1000, max: 500000, step: 1000, prefix: "₹" },
            { label: "Expected Return (p.a.)", value: rate, set: setRate, min: 1, max: 20, step: 0.5, suffix: "%" },
            { label: "Duration", value: years, set: setYears, min: 1, max: 30, step: 1, suffix: "Yrs" },
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
        <div className="flex flex-col justify-center">
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 92%)" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(210, 10%, 46%)" />
                <YAxis tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} stroke="hsl(210, 10%, 46%)" />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Area type="monotone" dataKey="balance" stroke="hsl(162, 63%, 41%)" fill="hsl(162, 63%, 41%)" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Total Withdrawn</span><span className="font-semibold text-foreground">{fmt(totalWithdrawn)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Final Balance</span><span className="font-semibold text-primary">{fmt(finalBalance)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
const EducationalContent = () => (
  <div className="prose prose-sm max-w-none space-y-8">
    <div className="card-elevated p-6 sm:p-8 space-y-4">
      <h2 className="text-xl font-bold text-foreground">What is an SWP Calculator?</h2>
      <p className="text-muted-foreground">A Systematic Withdrawal Plan (SWP) calculator helps you estimate how long your investment will last if you withdraw a fixed amount every month, while the remaining investment continues to earn returns.</p>
    </div>
    <div className="card-elevated p-6 sm:p-8 space-y-4">
      <h2 className="text-xl font-bold text-foreground">How SWP Works</h2>
      <p className="text-muted-foreground">In an SWP, you invest a lump sum in a mutual fund and withdraw a fixed amount at regular intervals. The remaining corpus stays invested and continues to grow, giving you a steady income stream while your capital appreciates.</p>
    </div>
    <div className="card-elevated p-6 sm:p-8 space-y-4">
      <h2 className="text-xl font-bold text-foreground">Benefits of SWP</h2>
      <ul className="text-muted-foreground space-y-2 list-disc pl-5">
        <li><strong>Regular Income:</strong> Get a fixed monthly income similar to a salary or pension.</li>
        <li><strong>Tax Efficiency:</strong> Only the capital gains portion of each withdrawal is taxed, not the entire amount.</li>
        <li><strong>Capital Appreciation:</strong> Your remaining investment continues to grow.</li>
        <li><strong>Flexibility:</strong> You can adjust withdrawal amounts or stop anytime.</li>
      </ul>
    </div>
    <div className="card-elevated p-6 sm:p-8 space-y-4">
      <h2 className="text-xl font-bold text-foreground">Example Withdrawal Scenario</h2>
      <p className="text-muted-foreground">If you invest ₹25,00,000 with a monthly withdrawal of ₹25,000 at 8% annual returns for 15 years:</p>
      <ul className="text-muted-foreground space-y-1 list-disc pl-5">
        <li>Total Withdrawn: ₹45,00,000</li>
        <li>Remaining Balance: Approximately ₹18,00,000+</li>
      </ul>
      <p className="text-muted-foreground">This means you'd withdraw nearly double your investment while still retaining a significant corpus.</p>
    </div>
  </div>
);
const SWPCalculator = () => (
  <CalculatorLayout
    title="SWP Calculator"
    description="Plan your systematic withdrawal strategy and estimate returns over time."
    calculator={<SWPCalc />}
    educationalContent={<EducationalContent />}
  />
);
export default SWPCalculator;