import { useState, useMemo, ComponentType, SVGProps } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalculatorLayout from "@/components/CalculatorLayout";
import AnimatedNumber from "@/components/AnimatedNumber";
import { TrendingUp, Wallet, IndianRupee, Lightbulb, ChevronUp } from "lucide-react";

const fmt = (v: number) => "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const ResultCard = ({ icon: Icon, label, value, color = "text-foreground" }: { icon: ComponentType<SVGProps<SVGSVGElement>>; label: string; value: number; color?: string }) => (
  <div className="card-elevated p-4 flex flex-col gap-1 !transform-none">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
    </div>
    <AnimatedNumber value={value} format={fmt} className={`text-lg font-bold ${color}`} />
  </div>
);

const SIPCalc = () => {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const [stepUpEnabled, setStepUpEnabled] = useState(false);
  const [stepUpPercent, setStepUpPercent] = useState(10);
  const { invested, total, returns, pieData, yearlyData } = useMemo(() => {
    const r = rate / 100 / 12;
    if (!stepUpEnabled) {
      const n = years * 12;
      const inv = monthly * n;
      const tot = r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : inv;
      const yearly: { year: string; invested: number; value: number; returns: number }[] = [];
      for (let y = 1; y <= years; y++) {
        const m = y * 12;
        const val = r > 0 ? monthly * ((Math.pow(1 + r, m) - 1) / r) * (1 + r) : monthly * m;
        yearly.push({ year: `Yr ${y}`, invested: monthly * m, value: Math.round(val), returns: Math.round(val - monthly * m) });
      }
      return {
        invested: inv,
        total: Math.round(tot),
        returns: Math.round(tot - inv),
        pieData: [{ name: "Invested", value: inv }, { name: "Returns", value: Math.round(tot - inv) }],
        yearlyData: yearly,
      };
    }
    // Step-up SIP: increase monthly by stepUpPercent% each year
    let balance = 0;
    let totalInv = 0;
    let currentMonthly = monthly;
    const yearly: { year: string; invested: number; value: number; returns: number }[] = [];
    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        balance = (balance + currentMonthly) * (1 + r);
        totalInv += currentMonthly;
      }
      yearly.push({ year: `Yr ${y}`, invested: Math.round(totalInv), value: Math.round(balance), returns: Math.round(balance - totalInv) });
      currentMonthly = Math.round(currentMonthly * (1 + stepUpPercent / 100));
    }

    return {
      invested: Math.round(totalInv),
      total: Math.round(balance),
      returns: Math.round(balance - totalInv),
      pieData: [{ name: "Invested", value: Math.round(totalInv) }, { name: "Returns", value: Math.round(balance - totalInv) }],
      yearlyData: yearly,
    };
  }, [monthly, rate, years, stepUpEnabled, stepUpPercent]);

  const insightExtra = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const extra = r > 0 ? (monthly + 2000) * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : (monthly + 2000) * n;
    return Math.round(extra - total);
  }, [monthly, rate, years, total]);

  const controls = [
    { label: "Monthly Investment", value: monthly, set: setMonthly, min: 500, max: 200000, step: 500, prefix: "₹" },
    { label: "Expected Return (p.a.)", value: rate, set: setRate, min: 1, max: 30, step: 0.5, suffix: "%" },
    { label: "Time Period", value: years, set: setYears, min: 1, max: 40, step: 1, suffix: "Yrs" },
  ];

  return (
    <div className="space-y-6">
      <div className="card-elevated p-6 sm:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {controls.map(({ label, value, set, min, max, step, prefix, suffix }) => (
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

            {/* Step-up SIP toggle */}
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ChevronUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Step-up SIP</span>
                </div>
                <Switch checked={stepUpEnabled} onCheckedChange={setStepUpEnabled} />
              </div>
              {stepUpEnabled && (
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs text-muted-foreground">Annual increase</label>
                    <div className="flex items-center gap-1">
                      <Input type="number" value={stepUpPercent} onChange={e => setStepUpPercent(Math.max(1, Math.min(50, +e.target.value)))} className="w-16 h-7 text-xs text-right" />
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                  </div>
                  <Slider value={[stepUpPercent]} onValueChange={v => setStepUpPercent(v[0])} min={1} max={50} step={1} />
                </div>
              )}
            </div>

          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-44 h-44 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                    <Cell fill="hsl(162, 63%, 41%)" />
                    <Cell fill="hsl(210, 20%, 88%)" />
                  </Pie>
                  <Tooltip formatter={(v: number) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Invested</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-muted inline-block" /> Returns</span>
            </div>
           </div>
        </div>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <ResultCard icon={Wallet} label="Invested Amount" value={invested} />
        <ResultCard icon={TrendingUp} label="Est. Returns" value={returns} color="text-primary" />
        <ResultCard icon={IndianRupee} label="Total Value" value={total} />
      </div>

      {/* Tabs: Chart + Table */}
      <div className="card-elevated p-6 sm:p-8 !transform-none">
        <Tabs defaultValue="chart">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Growth Chart</TabsTrigger>
            <TabsTrigger value="table">Year-by-Year</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 92%)" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(210, 10%, 46%)" />
                  <YAxis tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} stroke="hsl(210, 10%, 46%)" />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Legend />
                  <Area type="monotone" dataKey="invested" stroke="hsl(210, 20%, 78%)" fill="hsl(210, 20%, 92%)" fillOpacity={0.4} strokeWidth={2} name="Invested" />
                  <Area type="monotone" dataKey="value" stroke="hsl(162, 63%, 41%)" fill="hsl(162, 63%, 41%)" fillOpacity={0.12} strokeWidth={2} name="Total Value" />
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
                    <th className="text-right p-2.5 font-medium text-muted-foreground">Invested</th>
                    <th className="text-right p-2.5 font-medium text-muted-foreground">Returns</th>
                    <th className="text-right p-2.5 font-medium text-muted-foreground">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyData.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-2.5 text-foreground">{row.year}</td>
                      <td className="p-2.5 text-right text-foreground">{fmt(row.invested)}</td>
                      <td className="p-2.5 text-right text-primary">{fmt(row.returns)}</td>
                      <td className="p-2.5 text-right font-medium text-foreground">{fmt(row.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Smart Insight */}
      <div className="card-elevated p-5 flex items-start gap-3 border-primary/20 !transform-none">
        <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Smart Insight:</span> If you increase your SIP by ₹2,000/month, your total value could grow by an additional <span className="font-semibold text-primary">{fmt(insightExtra)}</span> over {years} years.
          {stepUpEnabled && <> With step-up enabled at {stepUpPercent}% annually, your final monthly SIP will be <span className="font-semibold text-primary">{fmt(Math.round(monthly * Math.pow(1 + stepUpPercent / 100, years - 1)))}</span>.</>}
        </p>
      </div>
    </div>
  );
};

const EducationalContent = () => (
  <div className="prose prose-sm max-w-none space-y-6">
    {[
      { title: "What is a SIP Calculator?", body: "A SIP (Systematic Investment Plan) calculator helps you estimate the potential returns on your mutual fund investments made through regular monthly contributions. It uses the power of compounding to project your wealth growth over time." },
      { title: "How Does a SIP Calculator Work?", body: "The calculator uses the compound interest formula: FV = P × [(1+r)^n − 1] / r × (1+r), where P is the monthly amount, r is the monthly rate, and n is the number of months. The step-up variant increases the SIP amount annually by a fixed percentage." },
      { title: "What is a Step-Up SIP?", body: "A Step-Up SIP increases your investment amount annually by a set percentage, aligning with salary increments. This can dramatically increase your final corpus — even a 10% annual step-up can nearly double the maturity value over 15–20 years." },
    ].map(s => (
      <div key={s.title} className="card-elevated p-6 sm:p-8 space-y-3 !transform-none">
        <h2 className="text-lg font-bold text-foreground">{s.title}</h2>
        <p className="text-muted-foreground">{s.body}</p>
      </div>
    ))}
    <div className="card-elevated p-6 sm:p-8 space-y-3 !transform-none">
      <h2 className="text-lg font-bold text-foreground">Benefits of Investing Through SIP</h2>
      <ul className="text-muted-foreground space-y-2 list-disc pl-5">
        <li><strong>Rupee Cost Averaging:</strong> Buy more units when prices are low, fewer when high.</li>
        <li><strong>Power of Compounding:</strong> Returns earn returns, accelerating wealth over time.</li>
        <li><strong>Disciplined Investing:</strong> Automated investments build a savings habit.</li>
        <li><strong>Flexibility:</strong> Start with as little as ₹500/month and increase as income grows.</li>
      </ul>
    </div>
  </div>
);

const SIPCalculator = () => (
  <CalculatorLayout
    title="SIP Calculator"
    description="Project how your investments can grow over time with the power of compounding."
    calculator={<SIPCalc />}
    educationalContent={<EducationalContent />}
  />
);

export default SIPCalculator;