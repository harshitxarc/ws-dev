import ScrollReveal from "./ScrollReveal";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

const SectionHeading = ({ badge, title, subtitle, center = true }: SectionHeadingProps) => (
  <ScrollReveal className={`mb-12 sm:mb-16 ${center ? "text-center" : ""}`}>
    {badge && (
      <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
        {badge}
      </span>
    )}
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    )}
  </ScrollReveal>
);

export default SectionHeading;
