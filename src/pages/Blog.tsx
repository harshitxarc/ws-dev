import { Link } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

const categories = ["All", "Investments", "Tax Planning", "Insurance", "Retirement", "Financial Tips"];

const posts = [
  { id: 1, title: "5 Smart Investment Strategies for 2025 and Beyond", category: "Investments", date: "Mar 5, 2026", excerpt: "Discover proven investment strategies that can help you build long-term wealth while managing risk effectively.", featured: true },
  { id: 2, title: "Tax-Saving Tips Every Salaried Professional Should Know", category: "Tax Planning", date: "Feb 28, 2026", excerpt: "Learn how to maximize your tax savings under Section 80C, 80D, and other provisions of the Income Tax Act.", featured: true },
  { id: 3, title: "Planning Your Retirement: Start Early, Retire Rich", category: "Retirement", date: "Feb 20, 2026", excerpt: "A comprehensive guide to building a robust retirement corpus that ensures financial independence." },
  { id: 4, title: "Understanding Mutual Funds: A Beginner's Guide", category: "Investments", date: "Feb 15, 2026", excerpt: "Everything you need to know about mutual funds — types, benefits, risks, and how to start investing." },
  { id: 5, title: "Term Insurance vs Whole Life Insurance: Which is Better?", category: "Insurance", date: "Feb 10, 2026", excerpt: "A detailed comparison to help you choose the right life insurance policy for your family's needs." },
  { id: 6, title: "10 Financial Habits of Wealthy People", category: "Financial Tips", date: "Feb 5, 2026", excerpt: "Adopt these time-tested financial habits practiced by successful wealth builders around the world." },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="hero-gradient-bg pt-28 sm:pt-36 pb-16 sm:pb-20">
        <div className="container-narrow section-padding !py-0 text-center">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              Blog & Insights
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6">
              Financial <span className="gradient-text">Knowledge Hub</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Expert insights on investments, tax planning, insurance, and wealth management.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-border">
        <div className="container-narrow px-4 sm:px-6 lg:px-8 py-4 flex gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Posts */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {posts.filter(p => p.featured).map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 0.1}>
                <div className="card-elevated overflow-hidden group cursor-pointer h-full flex flex-col">
                  <div className="h-56 bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-primary/20" />
                  </div>
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{post.category}</span>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-3">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{post.excerpt}</p>
                    <span className="text-primary text-sm font-semibold flex items-center gap-1 mt-4">
                      Read more <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <SectionHeading badge="Latest Articles" title="More Insights" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.filter(p => !p.featured).map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 0.08}>
                <div className="card-elevated overflow-hidden group cursor-pointer h-full flex flex-col">
                  <div className="h-40 bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-primary/20" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{post.category}</span>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{post.excerpt}</p>
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

export default Blog;
