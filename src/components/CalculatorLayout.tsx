import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import RelatedCalculators from "@/components/RelatedCalculators";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
interface CalculatorLayoutProps {
  title: string;
  description: string;
  calculator: ReactNode;
  educationalContent: ReactNode;
}
const CalculatorLayout = ({ title, description, calculator, educationalContent }: CalculatorLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 sm:pt-24">
        {/* Premium Hero */}
        <section className="relative overflow-hidden hero-gradient-bg border-b border-border">
          <div className="section-padding !py-12 sm:!py-16">
            <div className="container-narrow max-w-4xl relative z-10">
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Calculator className="w-6 h-6" />
                  </motion.div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">Financial Tool</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 tracking-tight">{title}</h1>
                <p className="text-muted-foreground text-base sm:text-lg max-w-xl">{description}</p>
              </ScrollReveal>
            </div>
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          </div>
        </section>
        {/* Calculator */}
        <section className="section-padding !py-10 sm:!py-14">
          <div className="container-narrow max-w-4xl">
            <ScrollReveal delay={0.1}>
              {calculator}
            </ScrollReveal>
          </div>
        </section>

        {/* Educational Content */}
        <section className="section-padding !pt-0 !pb-12">
          <div className="container-narrow max-w-4xl">
            <ScrollReveal delay={0.15}>
              {educationalContent}
            </ScrollReveal>
          </div>
        </section>
        
        {/* Related Calculators */}
        <RelatedCalculators />
      </main>
      <Footer />
    </div>
  );
};
export default CalculatorLayout;