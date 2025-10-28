import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { 
  BarChart3, 
  Moon, 
  Package, 
  Sun, 
  TrendingUp, 
  Users, 
  Zap,
  CheckCircle2,
  Store,
  ArrowRight
} from "lucide-react";

interface ProductsData {
  pillars: any[];
  traction_metrics: {
    core_platform?: any;
    product_specific?: any;
    network_effects?: any;
    pritchard_impact?: any;
    growth_pipeline?: any;
    revenue_traction?: any;
    strategic_validations?: any;
    legacy_metrics?: any;
    stakeholders?: Record<string, any>;
    user_counts?: Record<string, number>;
    vehicles_tracked?: number;
    upfit_status_updates?: number;
    logins?: Record<string, any>;
    PNI_network?: Record<string, any>;
    paperx_analytics?: Record<string, any>;
  };
  last_updated: string;
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [data, setData] = useState<ProductsData | null>(null);

  useEffect(() => {
    fetch("/products-data.json")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const allProducts = data.pillars.flatMap(p => p.products);
  const deliveredFeatures = allProducts.reduce(
    (acc, p) => acc + p.features.filter(f => f.delivered).length, 
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <img 
                  src="/shaed-logo.png" 
                  alt="SHAED" 
                  className="h-8 md:h-10 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">SHAED Overview Dashboard</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive platform analytics and insights for the SHAED ecosystem
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Products & Features */}
          <Link href="/products">
            <Card className="border-border bg-card hover:border-primary/50 transition-all duration-200 hover:shadow-lg cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                    <Package className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">Products & Features</CardTitle>
                    <CardDescription>Explore our product portfolio and capabilities</CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Traction Metrics */}
          <Link href="/traction-metrics">
            <Card className="border-border bg-card hover:border-primary/50 transition-all duration-200 hover:shadow-lg cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">Traction Metrics</CardTitle>
                    <CardDescription>Key performance indicators and growth metrics</CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Platform Partners */}
          <Link href="/platform-partners">
            <Card className="border-border bg-card hover:border-primary/50 transition-all duration-200 hover:shadow-lg cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">Platform Partners</CardTitle>
                    <CardDescription>Stakeholder analysis and partner network</CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Market Analysis */}
          <Link href="/market-analysis">
            <Card className="border-border bg-card hover:border-primary/50 transition-all duration-200 hover:shadow-lg cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                    <BarChart3 className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">Market Analysis</CardTitle>
                    <CardDescription>Ecosystem insights and market intelligence</CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Dealer Metrics */}
          <Link href="/dealer-metrics">
            <Card className="border-border bg-card hover:border-primary/50 transition-all duration-200 hover:shadow-lg cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
                    <Store className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">Dealer Metrics</CardTitle>
                    <CardDescription>Dealer performance and analytics</CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Product Roadmap */}
          <Link href="/product-roadmap">
            <Card className="border-border bg-card hover:border-primary/50 transition-all duration-200 hover:shadow-lg cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                    <Zap className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">Product Roadmap</CardTitle>
                    <CardDescription>Future development plans and milestones</CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">50,000+</div>
                <div className="text-sm text-muted-foreground">Vehicles Tracked</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">$2.8B</div>
                <div className="text-sm text-muted-foreground">Transaction Value</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">7,800+</div>
                <div className="text-sm text-muted-foreground">Platform Logins</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">70,434</div>
                <div className="text-sm text-muted-foreground">Documents Processed</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-6">
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://shaed.ai/', '_blank')}
              className="text-sm"
            >
              SHAED Website
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://www.linkedin.com/company/shaed/', '_blank')}
              className="text-sm"
            >
              LinkedIn
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}