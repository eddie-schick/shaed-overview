import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Products from "./pages/Products";
import TractionMetrics from "./pages/TractionMetrics";
import PlatformPartners from "./pages/PlatformPartners";
import MarketAnalysis from "./pages/MarketAnalysis";
import DealerMetricsPage from "./pages/DealerMetrics";
import ProductRoadmapPage from "./pages/ProductRoadmap";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/products"} component={Products} />
      <Route path={"/traction-metrics"} component={TractionMetrics} />
      <Route path={"/platform-partners"} component={PlatformPartners} />
      <Route path={"/market-analysis"} component={MarketAnalysis} />
      <Route path={"/dealer-metrics"} component={DealerMetricsPage} />
      <Route path={"/product-roadmap"} component={ProductRoadmapPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
