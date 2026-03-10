import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, TrendingUp, ChevronDown, Calculator, BarChart3, Landmark, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

const calculatorTools = [
  { label: "SIP Calculator", desc: "Estimate returns on a SIP", path: "/sip-calculator", icon: TrendingUp },
  { label: "Brokerage Calculator", desc: "Estimates charges for your trade/investments", path: "/brokerage-calculator", icon: BarChart3 },
  { label: "Margin Calculator", desc: "Estimate balance needed to buy/sell the stock", path: "/margin-calculator", icon: Landmark },
  { label: "SWP Calculator", desc: "Returns on your systematic withdrawal plan", path: "/swp-calculator", icon: Wallet },
];


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  const hoverTimeout = useRef<ReturnType<typeof setTimeout>>();
  const isMoreActive = calculatorTools.some(t => location.pathname === t.path);
  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout.current);
    setMoreOpen(true);
  };
  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setMoreOpen(false), 200);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  };

  const handleLinkClick = (path: string) => {
    setIsOpen(false);
    if (location.pathname === path) {
      scrollToTop();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background backdrop-blur-xl border-b border-border">
      <div className="container-narrow section-padding !py-0 flex items-center justify-between h-16 sm:h-20">
        <Link to="/" onClick={() => handleLinkClick("/")} className="flex items-center gap-2">
          <img src="/wealth-suraksha-logo.png" alt="Wealth Suraksha" className="h-12 sm:h-12 md:h-16 w-auto" />
          <span className="text-base sm:text-lg font-bold text-foreground">
            Wealth<span className="text-primary">Suraksha</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => handleLinkClick(link.path)}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* More Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                isMoreActive ? "text-primary" : "text-muted-foreground"
              }`}
              aria-haspopup="true"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen(!moreOpen)}
            >
              More
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-xl shadow-lg overflow-hidden"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="p-2">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Financial Calculators</p>
                    </div>
                    {calculatorTools.map((tool) => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-accent/50 group ${
                          location.pathname === tool.path ? "bg-accent/30" : ""
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                          <tool.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{tool.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link 
            to="/contact" 
            onClick={() => handleLinkClick("/contact")}
            className="btn-primary-glow !py-2.5 !px-6 text-sm"
          >
            Book Consultation
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`block py-2.5 text-sm font-medium ${
                    location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile More */}
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center justify-between w-full py-2.5 text-sm font-medium ${
                  isMoreActive ? "text-primary" : "text-muted-foreground"
                }`}
                aria-expanded={moreOpen}
              >
                More
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pl-3 space-y-1 overflow-hidden"
                  >
                    {calculatorTools.map((tool) => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        onClick={() => { setMoreOpen(false); setIsOpen(false); }}
                        className={`flex items-center gap-3 py-2.5 text-sm ${
                          location.pathname === tool.path ? "text-primary font-medium" : "text-muted-foreground"
                        }`}
                      >
                        <tool.icon className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{tool.label}</p>
                          <p className="text-xs text-muted-foreground">{tool.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <Link
                to="/contact"
                onClick={() => handleLinkClick("/contact")}
                className="btn-primary-glow block text-center text-sm !py-2.5 mt-2"
              >
                Book Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
