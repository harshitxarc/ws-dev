import { Link } from "react-router-dom";
import { TrendingUp, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-narrow section-padding !pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">
                Wealth<span className="text-primary">Suraksha</span>
              </span>
            </Link>
            <p className="text-sm opacity-70 leading-relaxed">
              Building your wealth. Securing your legacy. Expert financial advisory for individuals, NRIs, SMEs & corporates since 2019.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider opacity-80">Services</h4>
            <ul className="space-y-2.5">
              {["Investment Advisory", "Tax Planning", "Insurance Solutions", "Retirement Planning", "Real Estate", "Loan Services"].map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-sm opacity-60 hover:opacity-100 transition-opacity hover:text-primary">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider opacity-80">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", path: "/about" },
                { label: "Our Services", path: "/services" },
                { label: "Blog & Insights", path: "/blog" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm opacity-60 hover:opacity-100 transition-opacity hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider opacity-80">Get In Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-sm opacity-70">+91 95822 50626</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-sm opacity-70">info@wealthsuraksha.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-sm opacity-70">New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-50">
            © {new Date().getFullYear()} Wealth Suraksha IMF LLP. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs opacity-50 hover:opacity-80 cursor-pointer">Privacy Policy</span>
            <span className="text-xs opacity-50 hover:opacity-80 cursor-pointer">Terms of Service</span>
            <span className="text-xs opacity-50 hover:opacity-80 cursor-pointer">Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
