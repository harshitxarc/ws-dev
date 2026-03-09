import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CounterProps {
  value: string;
  duration?: number;
}

const Counter = ({ value, duration = 2 }: CounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Extract numeric value from the string (e.g., "6+" -> 6, "500+" -> 500, "50" -> 50, "98%" -> 98)
  const numericValue = parseInt(value.replace(/[^\d]/g, ""), 10);

  useEffect(() => {
    let animationFrame: number;
    let currentValue = 0;
    const increment = numericValue / (duration * 60); // Assuming 60fps

    const animate = () => {
      currentValue += increment;
      if (currentValue < numericValue) {
        setDisplayValue(Math.floor(currentValue));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [numericValue, duration]);

  // Reconstruct the display value with the original suffix
  const suffix = value.replace(/\d/g, "").replace("+", "");
  const hasPlus = value.includes("+");
  const displayText = `${displayValue}${hasPlus ? "+" : ""}${suffix}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-3xl sm:text-4xl font-extrabold text-primary"
    >
      {displayText}
    </motion.div>
  );
};

export default Counter;
