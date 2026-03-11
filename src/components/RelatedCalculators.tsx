import { Link, useLocation } from "react-router-dom";
import { Calculator, TrendingUp, BarChart3, ArrowDownUp } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
const calculators = [
  { path: "/sip-calculator", title: "SIP Calculator", desc: "Estimate returns on your systematic investment plan", icon: TrendingUp },
  { path: "/brokerage-calculator", title: "Brokerage Calculator", desc: "Estimate charges for your trades & investments", icon: BarChart3 },
  { path: "/margin-calculator", title: "Margin Calculator", desc: "Estimate balance needed to buy/sell stocks", icon: Calculator },
  { path: "/swp-calculator", title: "SWP Calculator", desc: "Returns on your systematic withdrawal plan", icon: ArrowDownUp },
];
const RelatedCalculators = () => {
  const { pathname } = useLocation();
  const related = calculators.filter(c => c.path !== pathname);
  return (
    <section className="section-padding !pt-0">
      <div className="container-narrow max-w-4xl">
        <ScrollReveal>
          <h2 className="text-xl font-bold text-foreground mb-6">Related Tools</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map(c => (
              <Link
                key={c.path}
                to={c.path}
                className="card-elevated p-5 group flex flex-col gap-3 no-underline"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                  <c.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{c.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
export default RelatedCalculators;