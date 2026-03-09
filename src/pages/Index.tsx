import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp, Shield, PiggyBank, Home as HomeIcon, FileText, Landmark,
  Users, Award, Clock, CheckCircle2, ArrowRight, Star, ChevronRight,
  Target, Lightbulb, HandshakeIcon, BarChart3
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import Counter from "@/components/Counter";

const services = [
  { icon: TrendingUp, title: "Investment Advisory", desc: "Strategic investment planning across mutual funds, equities, and alternative assets to maximize your returns.", color: "bg-primary/10 text-primary" },
  { icon: FileText, title: "Tax Planning", desc: "Comprehensive tax optimization strategies to legally minimize your tax burden and maximize savings.", color: "bg-blue-50 text-blue-600" },
  { icon: Shield, title: "Insurance Solutions", desc: "Tailored life, health, and general insurance plans to protect you and your family from uncertainties.", color: "bg-amber-50 text-amber-600" },
  { icon: PiggyBank, title: "Retirement Planning", desc: "Build a secure retirement corpus with personalized strategies for a worry-free future.", color: "bg-rose-50 text-rose-600" },
  { icon: HomeIcon, title: "Real Estate Advisory", desc: "Expert guidance on property investments, portfolio diversification, and real estate wealth creation.", color: "bg-violet-50 text-violet-600" },
  { icon: Landmark, title: "Loan Services", desc: "Access competitive loan options for home, business, and personal needs with expert assistance.", color: "bg-cyan-50 text-cyan-600" },
];

const stats = [
  { value: "6+", label: "Years of Experience" },
  { value: "500+", label: "Happy Clients" },
  { value: "₹50Cr+", label: "Assets Managed" },
  { value: "98%", label: "Client Retention" },
];

const steps = [
  { num: "01", title: "Free Consultation", desc: "Share your financial goals and concerns with our expert advisors." },
  { num: "02", title: "Financial Assessment", desc: "We analyze your current financial health, risk profile, and aspirations." },
  { num: "03", title: "Custom Strategy", desc: "Receive a personalized financial plan tailored to your unique needs." },
  { num: "04", title: "Implementation", desc: "We execute the strategy with precision and transparency." },
  { num: "05", title: "Ongoing Support", desc: "Continuous monitoring, reviews, and adjustments to keep you on track." },
];

const testimonials = [
  { name: "Rajesh Sharma", role: "Business Owner", text: "Wealth Suraksha transformed my financial outlook. Their personalized approach and deep market knowledge helped me grow my portfolio by 40% in just two years.", rating: 5 },
  { name: "Priya Mehta", role: "IT Professional", text: "As an NRI, managing finances in India was challenging. The team at Wealth Suraksha made it seamless with their expert tax planning and investment advisory.", rating: 5 },
  { name: "Amit Gupta", role: "Retired Government Officer", text: "Their retirement planning service gave me complete peace of mind. I now enjoy a steady income stream without any financial worries.", rating: 5 },
];

const whyChooseUs = [
  { icon: Target, title: "Goal-Oriented Planning", desc: "Every strategy is aligned with your specific financial objectives and life goals." },
  { icon: Lightbulb, title: "Expert Guidance", desc: "Certified advisors with deep market knowledge and years of industry experience." },
  { icon: HandshakeIcon, title: "Transparent Approach", desc: "No hidden fees, complete transparency in every recommendation we make." },
  { icon: BarChart3, title: "Proven Track Record", desc: "Consistently delivering superior returns and client satisfaction since 2019." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-gradient-bg pt-28 sm:pt-36 pb-16 sm:pb-24 relative overflow-hidden">
        {/* Floating shapes */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 animate-float blur-3xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-accent/5 animate-float blur-3xl" style={{ animationDelay: "2s" }} />

        <div className="container-narrow section-padding !py-0 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
                Trusted Financial Partner Since 2019
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] mb-6"
            >
              Building Your Wealth.{" "}
              <span className="gradient-text">Securing Your Legacy.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Expert wealth management for individuals, NRIs, SMEs & corporates. 
              Grow, protect, and pass on your wealth with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/contact" className="btn-primary-glow text-base flex items-center gap-2">
                Book Free Consultation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/services" className="btn-secondary-outline text-base">
                Explore Services
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="container-narrow section-padding !py-10 sm:!py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1} className="text-center">
                <Counter value={stat.value} duration={2} />
                <div className="text-sm text-muted-foreground font-medium mt-2">{stat.label}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding">
        <div className="container-narrow">
          <SectionHeading
            badge="Our Services"
            title="Comprehensive Financial Solutions"
            subtitle="From investments to insurance, we offer end-to-end financial services tailored to your unique needs."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 0.08}>
                <Link to="/services" className="card-elevated p-6 sm:p-8 block group h-full">
                  <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-5`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.desc}</p>
                  <span className="text-primary text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ChevronRight className="w-4 h-4" />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-secondary/50">
        <div className="container-narrow">
          <SectionHeading
            badge="Why Choose Us"
            title="Your Trusted Financial Partner"
            subtitle="We combine expertise, transparency, and personalized service to help you achieve financial freedom."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="text-center p-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="container-narrow">
          <SectionHeading
            badge="How It Works"
            title="Your Journey to Financial Freedom"
            subtitle="A simple, transparent process designed to help you achieve your financial goals."
          />
          <div className="max-w-3xl mx-auto space-y-0">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.1}>
                <div className="flex gap-6 relative pb-10 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step.num}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-px h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-lg font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-secondary/50">
        <div className="container-narrow">
          <SectionHeading
            badge="Testimonials"
            title="What Our Clients Say"
            subtitle="Real stories from clients who trusted us with their financial future."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.1}>
                <div className="card-elevated p-6 sm:p-8 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="section-padding">
        <div className="container-narrow">
          <SectionHeading
            badge="Insights"
            title="Financial Knowledge Hub"
            subtitle="Stay informed with expert insights on investments, taxes, and wealth management."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "5 Smart Investment Strategies for 2025", category: "Investments", date: "Mar 5, 2026" },
              { title: "Tax-Saving Tips Every Salaried Professional Should Know", category: "Tax Planning", date: "Feb 28, 2026" },
              { title: "Planning Your Retirement: Start Early, Retire Rich", category: "Retirement", date: "Feb 20, 2026" },
            ].map((post, i) => (
              <ScrollReveal key={post.title} delay={i * 0.1}>
                <Link to="/blog" className="card-elevated overflow-hidden block group">
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-primary/30" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{post.category}</span>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
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
                  Ready to Secure Your Financial Future?
                </h2>
                <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
                  Take the first step towards financial freedom. Book a free consultation with our expert advisors today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/contact"
                    className="bg-background text-foreground font-semibold rounded-xl px-8 py-3 hover:bg-background/90 transition-colors"
                  >
                    Schedule Free Consultation
                  </Link>
                  <a href="tel:+919582250626" className="text-primary-foreground font-semibold flex items-center gap-2 hover:underline">
                    <CheckCircle2 className="w-5 h-5" /> Call +91 95822 50626
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
