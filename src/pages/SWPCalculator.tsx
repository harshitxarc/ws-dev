import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalculatorLayout from "@/components/CalculatorLayout";
import AnimatedNumber from "@/components/AnimatedNumber";
import { Wallet, ArrowDownUp, IndianRupee, Lightbulb, Clock } from "lucide-react";

const fmt = (v: number) =>
  "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const SWPCalc = () => {
  const [initial, setInitial] = useState(2500000);
  const [withdrawal, setWithdrawal] = useState(25000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(15);

  const { totalWithdrawn, finalBalance, chartData, lastsSustainable, depletionYear } = 
  useMemo(() => {
      const monthlyRate = rate / 100 / 12;
      const months = years * 12;
      let balance = initial;

      const data = [{ month: 0, year: "Start", balance: initial, withdrawn: 0, withdrawals: 0 }];
      let withdrawn = 0;
      let depYear: number | null = null;

      for (let m = 1; m <= months; m++) {
        balance = balance * (1 + monthlyRate) - withdrawal;
        withdrawn += withdrawal;

        if (balance < 0) {
        balance = 0;
        withdrawn -= withdrawal;
        if (!depYear) depYear = Math.ceil(m / 12);
      }

        if (m % 12 === 0 || m === months) {
          data.push({
          month: m,
          year: `Yr ${Math.ceil(m / 12)}`,
          balance: Math.max(0, Math.round(balance)),
          withdrawn: Math.round(withdrawn),
          withdrawals: Math.round(withdrawal * Math.min(m, 12)),
        });
        }

        if (balance <= 0) break;
      }

      const sustainableMonthly = initial * monthlyRate;
      const sustainable = withdrawal <= sustainableMonthly;

      return {
      totalWithdrawn: Math.round(withdrawn),
      finalBalance: Math.max(0, Math.round(balance)),
      chartData: data,
      lastsSustainable: sustainable,
      depletionYear: depYear,
    };
    }, [initial, withdrawal, rate, years]);

    const sustainableWithdrawal = useMemo(() => Math.round(initial * (rate / 100 / 12)), [initial, rate]);

  const controls = [
    {
      label: "Initial Investment",
      value: initial,
      set: setInitial,
      min: 100000,
      max: 50000000,
      step: 50000,
      prefix: "₹",
    },
    {
      label: "Monthly Withdrawal",
      value: withdrawal,
      set: setWithdrawal,
      min: 1000,
      max: 500000,
      step: 1000,
      prefix: "₹",
    },
    {
      label: "Expected Return (p.a.)",
      value: rate,
      set: setRate,
      min: 1,
      max: 20,
      step: 0.5,
      suffix: "%",
    },
    {
      label: "Duration",
      value: years,
      set: setYears,
      min: 1,
      max: 30,
      step: 1,
      suffix: "Yrs",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="card-elevated p-6 sm:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            {controls.map(
              ({ label, value, set, min, max, step, prefix, suffix }) => (
                <div key={label}>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">
                      {label}
                    </label>
                    <div className="flex items-center gap-1">
                      {prefix && (
                        <span className="text-sm text-muted-foreground">
                          {prefix}
                        </span>
                      )}
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => set(Math.max(min, +e.target.value))}
                        className="w-28 h-8 text-sm text-right"
                      />
                      {suffix && (
                        <span className="text-sm text-muted-foreground">
                          {suffix}
                        </span>
                      )}
                    </div>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(v) => set(v[0])}
                    min={min}
                    max={max}
                    step={step}
                  />
                </div>
              )
            )}
          </div>

          <div className="flex flex-col justify-center space-y-4">
            {/* Sustainability indicator */}
            <div className={`p-3 rounded-lg border ${lastsSustainable ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`}>
              <div className="flex items-center gap-2 mb-1">
                <Clock className={`w-4 h-4 ${lastsSustainable ? "text-primary" : "text-destructive"}`} />
                <span className="text-xs font-semibold text-foreground">
                  {lastsSustainable ? "Corpus lasts indefinitely" : depletionYear ? `Corpus depletes in ~${depletionYear} years` : "Corpus will deplete"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Sustainable withdrawal: <span className="font-semibold text-foreground">{fmt(sustainableWithdrawal)}/mo</span>
              </p>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(210, 20%, 92%)"
                  />
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="hsl(210, 10%, 46%)" />
                  <YAxis tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 10 }} stroke="hsl(210, 10%, 46%)" />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="hsl(162, 63%, 41%)"
                    fill="hsl(162, 63%, 41%)"
                    fillOpacity={0.15}
                    strokeWidth={2}
                    name="Balance"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="card-elevated p-4 flex flex-col gap-1 !transform-none">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">
              Total Withdrawn
            </span>
          </div>
          <AnimatedNumber
            value={totalWithdrawn}
            format={fmt}
            className="text-lg font-bold text-foreground"
          />
        </div>

        <div className="card-elevated p-4 flex flex-col gap-1 !transform-none">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">
              Final Balance
            </span>
          </div>
          <AnimatedNumber
            value={finalBalance}
            format={fmt}
            className={`text-lg font-bold ${
              finalBalance > 0 ? "text-primary" : "text-destructive"
            }`}
          />
        </div>

        <div className="card-elevated p-4 flex flex-col gap-1 !transform-none">
          <div className="flex items-center gap-2 mb-1">
            <IndianRupee className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">
              Net Gain
            </span>
          </div>
          <AnimatedNumber
            value={totalWithdrawn + finalBalance - initial}
            format={fmt}
            className={`text-lg font-bold ${
              totalWithdrawn + finalBalance - initial >= 0
                ? "text-primary"
                : "text-destructive"
            }`}
          />
        </div>
      </div>
      {/* Tabs: Chart + Table */}
      <div className="card-elevated p-6 sm:p-8 !transform-none">
        <Tabs defaultValue="chart">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Withdrawal Chart</TabsTrigger>
            <TabsTrigger value="table">Year-by-Year</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.filter(d => d.month > 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 92%)" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(210, 10%, 46%)" />
                  <YAxis tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} stroke="hsl(210, 10%, 46%)" />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Legend />
                  <Area type="monotone" dataKey="balance" stroke="hsl(162, 63%, 41%)" fill="hsl(162, 63%, 41%)" fillOpacity={0.12} strokeWidth={2} name="Remaining Balance" />
                  <Area type="monotone" dataKey="withdrawn" stroke="hsl(210, 20%, 70%)" fill="hsl(210, 20%, 88%)" fillOpacity={0.3} strokeWidth={2} name="Total Withdrawn" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="table">
            <div className="max-h-64 overflow-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                  <tr>
                    <th className="text-left p-2.5 font-medium text-muted-foreground">Year</th>
                    <th className="text-right p-2.5 font-medium text-muted-foreground">Balance</th>
                    <th className="text-right p-2.5 font-medium text-muted-foreground">Withdrawn</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.filter(d => d.month > 0).map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-2.5 text-foreground">{row.year}</td>
                      <td className={`p-2.5 text-right font-medium ${row.balance > 0 ? "text-foreground" : "text-destructive"}`}>{fmt(row.balance)}</td>
                      <td className="p-2.5 text-right text-muted-foreground">{fmt(row.withdrawn)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div
        className={`card-elevated p-5 flex items-start gap-3 !transform-none ${
          lastsSustainable ? "border-primary/20" : "border-destructive/20"
        }`}
      >
        <Lightbulb
          className={`w-5 h-5 shrink-0 mt-0.5 ${
            lastsSustainable ? "text-primary" : "text-destructive"
          }`}
        />
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {lastsSustainable ? "Sustainable Plan:" : "Warning:"}
          </span>{" "}
          {lastsSustainable
            ? `Your withdrawal of ${fmt(withdrawal)}/month is within the returns generated (${fmt(sustainableWithdrawal)}/mo), meaning your corpus can sustain indefinitely at this rate.`
            : `Your withdrawal of ${fmt(withdrawal)}/month exceeds the monthly returns of ${fmt(sustainableWithdrawal)}. ${depletionYear ? `Your corpus will deplete in approximately ${depletionYear} years.` : ""} Consider reducing withdrawals to ${fmt(sustainableWithdrawal)}/month or less for sustainability.`}
        </p>
      </div>
    </div>
  );
};

const EducationalContent = () => (
  <div className="prose prose-sm max-w-none space-y-6">
    <div className="card-elevated p-6 sm:p-8 space-y-3 !transform-none">
      <h2 className="text-lg font-bold text-foreground">
        What is an SWP Calculator?
      </h2>
      <p className="text-muted-foreground">
        A Systematic Withdrawal Plan (SWP) calculator helps you estimate how long
        your investment will last if you withdraw a fixed amount every month,
        while the remaining investment continues to earn returns.
      </p>
    </div>
    <div className="card-elevated p-6 sm:p-8 space-y-3 !transform-none">
      <h2 className="text-lg font-bold text-foreground">Sustainable vs Unsustainable Withdrawals</h2>
      <p className="text-muted-foreground">If your monthly withdrawal is less than the monthly returns generated by your corpus, your investment can last indefinitely. This is the "sustainable withdrawal rate." Withdrawing more than this will gradually deplete your corpus.</p>
    </div>

    <div className="card-elevated p-6 sm:p-8 space-y-3 !transform-none">
      <h2 className="text-lg font-bold text-foreground">Benefits of SWP</h2>
      <ul className="text-muted-foreground space-y-2 list-disc pl-5">
        <li>
          <strong>Regular Income:</strong> Get a fixed monthly income similar to
          a salary or pension.
        </li>
        <li>
          <strong>Tax Efficiency:</strong> Only the capital gains portion of
          each withdrawal is taxed.
        </li>
        <li>
          <strong>Capital Appreciation:</strong> Remaining investment continues
          to grow.
        </li>
        <li>
          <strong>Flexibility:</strong> Adjust withdrawal amounts or stop anytime.
        </li>
      </ul>
    </div>
  </div>
);

const SWPCalculator = () => (
  <CalculatorLayout
    title="SWP Calculator"
    description="Plan your systematic withdrawal strategy and estimate how long your corpus lasts."
    calculator={<SWPCalc />}
    educationalContent={<EducationalContent />}
  />
);

export default SWPCalculator;
