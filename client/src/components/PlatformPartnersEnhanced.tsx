import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search, Filter, DollarSign, TrendingUp, Users, ExternalLink } from "lucide-react";

interface Stakeholder {
  name: string;
  type: string;
  products: string[];
  status: string;
  contractExecuted: string;
  broughtOnBy: string;
  comments: string;
  lastEdited: string;
}

interface PartnerMetrics {
  revenue: {
    value: string;
    source: string | null;
  };
  volume: {
    value: string;
    source: string | null;
  };
  employees: {
    value: string;
    source: string | null;
  };
}

export default function PlatformPartners() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [metrics, setMetrics] = useState<Record<string, PartnerMetrics>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load stakeholders CSV and metrics JSON
    Promise.all([
      fetch("/stakeholders.csv").then(res => res.text()),
      fetch("/partner-metrics.json").then(res => res.json())
    ])
      .then(([csvText, metricsData]) => {
        // Parse CSV
        const lines = csvText.split("\n").filter(line => line.trim());
        
        const parsed = lines.slice(1).map((line) => {
          const values: string[] = [];
          let current = "";
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          values.push(current.trim());

          return {
            name: values[0]?.replace(/^"|"$/g, '') || "",
            type: values[1]?.replace(/^"|"$/g, '') || "",
            products: values[2]?.replace(/^"|"$/g, '').split(",").map(p => p.trim()).filter(Boolean) || [],
            status: values[3]?.replace(/^"|"$/g, '') || "",
            contractExecuted: values[4]?.replace(/^"|"$/g, '') || "",
            broughtOnBy: values[5]?.replace(/^"|"$/g, '') || "",
            comments: values[6]?.replace(/^"|"$/g, '') || "",
            lastEdited: values[7]?.replace(/^"|"$/g, '') || "",
          };
        }).filter(s => s.name);

        setStakeholders(parsed);
        setMetrics(metricsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setLoading(false);
      });
  }, []);

  const stakeholderTypes = useMemo(() => {
    const types = new Set(stakeholders.map(s => s.type));
    return Array.from(types).sort();
  }, [stakeholders]);

  const products = useMemo(() => {
    const productSet = new Set<string>();
    stakeholders.forEach(s => s.products.forEach(p => productSet.add(p)));
    return Array.from(productSet).sort();
  }, [stakeholders]);

  const filteredStakeholders = useMemo(() => {
    return stakeholders.filter((stakeholder) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        stakeholder.name.toLowerCase().includes(searchLower) ||
        stakeholder.type.toLowerCase().includes(searchLower) ||
        stakeholder.products.some(p => p.toLowerCase().includes(searchLower)) ||
        stakeholder.broughtOnBy.toLowerCase().includes(searchLower);

      const matchesType = selectedType === "all" || stakeholder.type === selectedType;
      const matchesProduct = selectedProduct === "all" || 
        stakeholder.products.includes(selectedProduct);

      return matchesSearch && matchesType && matchesProduct;
    });
  }, [stakeholders, searchTerm, selectedType, selectedProduct]);

  const getProductBadgeColor = (product: string) => {
    const colors: Record<string, string> = {
      "CPQ": "bg-blue-100 text-blue-800",
      "SHAED Marketplace": "bg-green-100 text-green-800",
      "Order Management": "bg-purple-100 text-purple-800",
      "Upfit Portal": "bg-orange-100 text-orange-800",
      "Documentation": "bg-gray-100 text-gray-800",
    };
    return colors[product] || "bg-gray-100 text-gray-800";
  };

  const MetricWithSource = ({ value, source, icon: Icon }: { value: string; source: string | null; icon: any }) => {
    if (source) {
      return (
        <a 
          href={source} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium">{value}</span>
          <ExternalLink className="h-3 w-3 flex-shrink-0" />
        </a>
      );
    }
    return (
      <div className="flex items-center gap-1 text-gray-700">
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="font-medium">{value}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading platform partners...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types ({stakeholders.length})</SelectItem>
                {stakeholderTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type} ({stakeholders.filter(s => s.type === type).length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Product Filter */}
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products ({stakeholders.length})</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product} value={product}>
                    {product} ({stakeholders.filter(s => s.products.includes(product)).length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedType !== "all" || selectedProduct !== "all") && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-red-600">×</button>
                </Badge>
              )}
              {selectedType !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Type: {selectedType}
                  <button onClick={() => setSelectedType("all")} className="ml-1 hover:text-red-600">×</button>
                </Badge>
              )}
              {selectedProduct !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Product: {selectedProduct}
                  <button onClick={() => setSelectedProduct("all")} className="ml-1 hover:text-red-600">×</button>
                </Badge>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("all");
                  setSelectedProduct("all");
                }}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline ml-2"
              >
                Clear all filters
              </button>
            </div>
          )}

          <div className="text-sm text-gray-600 mt-4">
            Showing {filteredStakeholders.length} of {stakeholders.length} partners
          </div>
        </CardContent>
      </Card>

      {/* Partner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStakeholders.map((stakeholder) => {
          const partnerMetrics = metrics[stakeholder.name];
          
          return (
            <Card key={stakeholder.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{stakeholder.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <Badge variant="outline">{stakeholder.type}</Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* SHAED Products */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">SHAED Products</div>
                  <div className="flex flex-wrap gap-1">
                    {stakeholder.products.map((product) => (
                      <Badge key={product} className={getProductBadgeColor(product)}>
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                {partnerMetrics && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="text-sm font-medium text-gray-700 mb-2">2024 Metrics</div>
                    
                    {/* Revenue */}
                    <div className="text-sm">
                      <div className="text-gray-600 mb-1">Revenue</div>
                      <MetricWithSource 
                        value={partnerMetrics.revenue.value} 
                        source={partnerMetrics.revenue.source}
                        icon={DollarSign}
                      />
                    </div>

                    {/* Volume */}
                    <div className="text-sm">
                      <div className="text-gray-600 mb-1">Volume</div>
                      <MetricWithSource 
                        value={partnerMetrics.volume.value} 
                        source={partnerMetrics.volume.source}
                        icon={TrendingUp}
                      />
                    </div>

                    {/* Employees */}
                    <div className="text-sm">
                      <div className="text-gray-600 mb-1">Employees</div>
                      <MetricWithSource 
                        value={partnerMetrics.employees.value} 
                        source={partnerMetrics.employees.source}
                        icon={Users}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredStakeholders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No partners found matching your filters.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
                setSelectedProduct("all");
              }}
              className="mt-4 text-blue-600 hover:text-blue-800 hover:underline"
            >
              Clear all filters
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

