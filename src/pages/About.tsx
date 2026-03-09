import { Link } from "react-router-dom";
import { Award, Users, Target, Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

const milestones = [
  { year: "2019", title: "Founded", desc: "Wealth Suraksha LLP was established under the LLP Act, 2008." },
  { year: "2020", title: "Digital Expansion", desc: "Launched online portfolio management and digital advisory services." },
  { year: "2022", title: "500+ Clients", desc: "Crossed 500 happy clients milestone across India and NRI segment." },
  { year: "2024", title: "₹50Cr+ AUM", desc: "Achieved over ₹50 crore in assets under management." },
  { year: "2026", title: "Growing Strong", desc: "Continuing to expand services and empower more families financially." },
];

const values = [
  { icon: Target, title: "Client-First Approach", desc: "Every recommendation is made keeping your best interest at heart." },
  { icon: Award, title: "Certified Expertise", desc: "Our advisors hold industry-leading certifications and qualifications." },
  { icon: Users, title: "Personalized Service", desc: "No cookie-cutter solutions — every plan is tailored to your unique situation." },
  { icon: Clock, title: "Long-Term Partnership", desc: "We build lasting relationships, not one-time transactions." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient-bg pt-28 sm:pt-36 pb-16 sm:pb-20">
        <div className="container-narrow section-padding !py-0 text-center">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6">
              Your Trusted Partner in{" "}
              <span className="gradient-text">Wealth Creation</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              At Wealth Suraksha LLP, we believe true wealth is not just about accumulating assets — it's about creating a legacy that lasts.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 p-12 flex items-center justify-center aspect-square max-w-md">
                <TrendingUp className="w-32 h-32 text-primary/30" />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Building Wealth Since 2019
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded in 2019 and registered under the LLP Act, 2008, Wealth Suraksha LLP is an independent financial services firm offering tailored wealth management solutions for Individuals (Residents & NRIs), SMEs, and Corporates.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Whether you're planning for growth, stability, or succession, we are here to be your trusted financial partner every step of the way. With the right vision, expert guidance, and a client-focused approach, we help you grow, protect, and pass on your wealth with confidence.
              </p>
              <div className="space-y-3">
                {["AMFI Registered Mutual Fund Distributor", "Insurance Advisory (Life & General)", "Comprehensive Tax & Financial Planning"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary/50">
        <div className="container-narrow">
          <SectionHeading badge="Our Values" title="What Drives Us" subtitle="The principles that guide every financial decision we help you make." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div className="card-elevated p-6 text-center h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <v.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container-narrow">
          <SectionHeading badge="Our Journey" title="Milestones That Define Us" />
          <div className="max-w-2xl mx-auto">
            {milestones.map((m, i) => (
              <ScrollReveal key={m.year} delay={i * 0.1}>
                <div className="flex gap-6 pb-10 last:pb-0 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {m.year}
                    </div>
                    {i < milestones.length - 1 && <div className="w-px h-full bg-border mt-2" />}
                  </div>
                  <div className="pt-3">
                    <h3 className="font-bold text-foreground mb-1">{m.title}</h3>
                    <p className="text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
