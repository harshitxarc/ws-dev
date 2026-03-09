import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useToast } from "@/components/ui/use-toast";

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+91 95822 50626", href: "tel:+919582250626" },
  { icon: Mail, label: "Email", value: "info@wealthsuraksha.com", href: "mailto:info@wealthsuraksha.com" },
  { icon: MapPin, label: "Office", value: "New Delhi, India", href: "#" },
  { icon: Clock, label: "Hours", value: "Mon–Sat, 10 AM – 7 PM", href: "#" },
];

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. Our team will contact you within 24 hours.",
    });
    setForm({ name: "", email: "", phone: "", service: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="hero-gradient-bg pt-28 sm:pt-36 pb-16 sm:pb-20">
        <div className="container-narrow section-padding !py-0 text-center">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              Contact Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6">
              Let's Plan Your <span className="gradient-text">Financial Future</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Book a free consultation or get in touch with our expert financial advisors.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10">
            {/* Contact Info */}
            <ScrollReveal>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Get In Touch</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Have questions about our services? We're here to help you make informed financial decisions.
                  </p>
                </div>
                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="card-elevated p-4 flex items-center gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-medium">{item.label}</div>
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.value}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Form */}
            <ScrollReveal delay={0.2}>
              <form onSubmit={handleSubmit} className="card-elevated p-8 sm:p-10">
                <h3 className="text-xl font-bold text-foreground mb-6">Book a Free Consultation</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                    <input
                      type="email"
                      required
                      maxLength={255}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
                    <input
                      type="tel"
                      maxLength={15}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Service Interested In</label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select a service</option>
                      <option>Investment Advisory</option>
                      <option>Tax Planning</option>
                      <option>Insurance Solutions</option>
                      <option>Retirement Planning</option>
                      <option>Real Estate Advisory</option>
                      <option>Loan Services</option>
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                  <textarea
                    rows={4}
                    maxLength={1000}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Tell us about your financial goals..."
                  />
                </div>
                <button type="submit" className="btn-primary-glow w-full flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
