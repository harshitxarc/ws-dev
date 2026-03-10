import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import FloatingMarketWidget from "./components/FloatingMarketWidget";

const SIPCalculator = lazy(() => import("./pages/SIPCalculator"));
const BrokerageCalculator = lazy(() => import("./pages/BrokerageCalculator"));
const MarginCalculator = lazy(() => import("./pages/MarginCalculator"));
const SWPCalculator = lazy(() => import("./pages/SWPCalculator"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          // opt-in to v7 improvements early to silence console warnings
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sip-calculator" element={<SIPCalculator />} />
            <Route path="/brokerage-calculator" element={<BrokerageCalculator />} />
            <Route path="/margin-calculator" element={<MarginCalculator />} />
            <Route path="/swp-calculator" element={<SWPCalculator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <FloatingMarketWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
