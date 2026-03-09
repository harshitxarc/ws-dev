import { Link } from "react-router-dom";
import {
  TrendingUp, Shield, PiggyBank, Home as HomeIcon, FileText, Landmark,
  CheckCircle2, ArrowRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

const services = [
  {
    icon: TrendingUp,
    title: "Investment Advisory",
    desc: "Strategic investment planning across mutual funds, equities, bonds, and alternative assets to maximize your returns while managing risk.",
    benefits: ["Mutual Fund Selection & SIP Planning", "Equity Portfolio Management", "Goal-Based Investment Strategies", "NRI Investment Solutions"],
    color: "bg-primary/10 text-primary",
  },
  {
    icon: FileText,
    title: "Tax Planning & Filing",
    desc: "Comprehensive tax optimization strategies to legally minimize your tax burden, maximize deductions, and ensure compliance.",
    benefits: ["Income Tax Planning & Filing", "Capital Gains Optimization", "Tax-Saving Investment Advice", "GST & Business Tax Compliance"],
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Shield,
    title: "Insurance Solutions",
    desc: "Tailored life, health, and general insurance plans to protect you and your family from life's uncertainties.",
    benefits: ["Term Life Insurance", "Health & Medical Insurance", "Motor & Travel Insurance", "Business Liability Coverage"],
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: PiggyBank,
    title: "Retirement Planning",
    desc: "Build a secure retirement corpus with personalized strategies for a worry-free, financially independent future.",
    benefits: ["Pension & Annuity Planning", "NPS & PPF Advisory", "Retirement Income Strategies", "Early Retirement Planning"],
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: HomeIcon,
    title: "Real Estate Advisory",
    desc: "Expert guidance on property investments, portfolio diversification, and real estate wealth creation strategies.",
    benefits: ["Property Investment Analysis", "Portfolio Diversification", "REITs & Real Estate Funds", "Property Tax Optimization"],
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: Landmark,
    title: "Loan Services",
    desc: "Access competitive loan options for home, business, and personal needs with expert assistance and best rates.",
    benefits: ["Home Loan Advisory", "Business & MSME Loans", "Personal & Education Loans", "Loan Restructuring"],
    color: "bg-cyan-50 text-cyan-600",
  },
];

const Services = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  };

  const handleConsultationClick = () => {
    // If already on contact page, scroll to top
    if (window.location.pathname === '/contact') {
      scrollToTop();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="hero-gradient-bg pt-28 sm:pt-36 pb-16 sm:pb-20">
        <div className="container-narrow section-padding !py-0 text-center">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              Our Services
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6">
              Comprehensive <span className="gradient-text">Financial Solutions</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              End-to-end financial services tailored for individuals, NRIs, SMEs, and corporates.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow space-y-8">
          {services.map((service, i) => (
            <ScrollReveal key={service.title} delay={i * 0.05}>
              <div className="card-elevated p-8 sm:p-10 grid md:grid-cols-[1fr_1.2fr] gap-8 items-start">
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-5`}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">{service.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{service.desc}</p>
                  <Link to="/contact" className="btn-primary-glow !py-2.5 !px-6 text-sm inline-flex items-center gap-2">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="bg-secondary/50 rounded-2xl p-6">
                  <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">What's Included</h4>
                  <ul className="space-y-3">
                    {service.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="rounded-3xl bg-gradient-to-br from-primary to-accent p-10 sm:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-foreground mb-4">
                  Not Sure Which Service Is Right for You?
                </h2>
                <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
                  Book a free consultation and our advisors will create a customized financial plan for your goals.
                </p>
                <Link to="/contact" onClick={handleConsultationClick} className="bg-background text-foreground font-semibold rounded-xl px-8 py-3 inline-block hover:bg-background/90 transition-colors">
                  Book Free Consultation
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
