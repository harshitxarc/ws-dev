import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { ReactNode } from "react";
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
        <section className="section-padding !pt-8 !pb-12">
          <div className="container-narrow">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{title}</h1>
                <p className="text-muted-foreground text-base sm:text-lg">{description}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="max-w-4xl mx-auto">{calculator}</div>
            </ScrollReveal>
          </div>
        </section>
        <section className="section-padding !pt-0">
          <div className="container-narrow max-w-4xl">
            <ScrollReveal delay={0.15}>
              {educationalContent}
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
export default CalculatorLayout;