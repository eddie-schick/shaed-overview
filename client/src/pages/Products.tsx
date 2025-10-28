import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { 
  Moon, 
  Sun, 
  Package,
  ShoppingCart,
  FileText
} from "lucide-react";

interface Feature {
  name: string;
  description: string;
  monetizable: boolean;
  delivered?: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  features: Feature[];
  target_users: string[];
}

interface Pillar {
  id: string;
  name: string;
  description: string;
  icon: string;
  products: Product[];
}

interface ProductsData {
  pillars: Pillar[];
  traction_metrics: any;
  last_updated: string;
}

const pillarIcons: Record<string, any> = {
  "ShoppingCart": ShoppingCart,
  "Package": Package,
  "FileText": FileText
};

export default function Products() {
  const { theme, toggleTheme } = useTheme();
  const [data, setData] = useState<ProductsData | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<string>("all");
  const [selectedFeature, setSelectedFeature] = useState<{productId: string, feature: {name: string, description: string}} | null>(null);

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
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  const allProducts = data.pillars.flatMap(p => p.products);
  const filteredPillars = selectedPillar === "all" 
    ? data.pillars 
    : data.pillars.filter(p => p.id === selectedPillar);

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
        <div className="space-y-6">
          {/* Pillar Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPillar("all")}
              className={selectedPillar === "all" ? "bg-[#2FC774] text-white border-[#2FC774] hover:bg-[#2FC774]/90" : "bg-muted hover:bg-muted/80"}
            >
              All Products
            </Button>
            {data.pillars.map(pillar => (
              <Button
                key={pillar.id}
                variant="outline"
                size="sm"
                onClick={() => setSelectedPillar(pillar.id)}
                className={selectedPillar === pillar.id ? "bg-[#2FC774] text-white border-[#2FC774] hover:bg-[#2FC774]/90" : "bg-muted hover:bg-muted/80"}
              >
                {pillar.name}
              </Button>
            ))}
          </div>

          {/* Pillars Display */}
          <div className="space-y-8">
            {filteredPillars.map(pillar => {
              const Icon = pillarIcons[pillar.icon] || Package;

              return (
                <div key={pillar.id} className="space-y-4">
                  {/* Pillar Header */}
                  <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-1">{pillar.name}</CardTitle>
                          <CardDescription className="text-base">{pillar.description}</CardDescription>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-foreground">{pillar.products.length}</div>
                            <div className="text-xs text-muted-foreground">Products</div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Products in Pillar */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pl-4">
                    {pillar.products.map(product => {
                      return (
                        <Card key={product.id} className="border-border bg-card hover:border-primary/50 transition-colors">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                                <CardDescription className="text-sm">
                                  {product.description}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Features List */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-foreground">Key Features:</h4>
                              <ul className="space-y-1.5">
                                {product.features.map((feature, idx) => (
                                  <li key={idx} className="text-sm flex items-start gap-2">
                                    <span className="text-primary mt-1.5">•</span>
                                    <button
                                      onClick={() => setSelectedFeature({productId: product.id, feature})}
                                      className="flex-1 text-left text-foreground hover:text-primary transition-colors cursor-pointer underline decoration-dotted"
                                    >
                                      {feature.name}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Feature Detail Modal */}
                            {selectedFeature && selectedFeature.productId === product.id && (
                              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedFeature(null)}>
                                <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-foreground">{selectedFeature.feature.name}</h3>
                                    <button
                                      onClick={() => setSelectedFeature(null)}
                                      className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                  <p className="text-muted-foreground leading-relaxed">{selectedFeature.feature.description}</p>
                                </div>
                              </div>
                            )}

                            {/* Target Users */}
                            <div className="pt-3 border-t border-border">
                              <h4 className="text-xs font-semibold text-muted-foreground mb-2">TARGET USERS</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {product.target_users.map((user, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {user}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
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
