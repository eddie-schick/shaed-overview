import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, Search, Filter, Info, ExternalLink } from "lucide-react";

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
    display: string;
    rationale: string;
    source: string | null;
  };
  volume: {
    display: string;
    rationale: string;
    source: string | null;
  };
  employees: {
    display: string;
    rationale: string;
    source: string | null;
  };
}

interface MetricDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: string;
  source: string | null;
  partnerName: string;
}

function MetricDialog({ open, onOpenChange, title, value, source, partnerName }: MetricDialogProps) {
  // Check if this is an estimate by looking at the value text
  const isEstimate = value && (
    value.toLowerCase().includes('estimate') || 
    value.toLowerCase().includes('based on') ||
    value.toLowerCase().includes('no specific') ||
    value.toLowerCase().includes('likely') ||
    value.toLowerCase().includes('(est') ||
    value.toLowerCase().includes('rationale:')
  );
  
  const hasSourceLink = source && source.startsWith('http');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{partnerName} - {title}</DialogTitle>
          <DialogDescription className="text-base font-semibold text-foreground mt-2">
            {value}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {isEstimate ? (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-amber-700 mb-2">Estimated Value</div>
                  <div className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {source}
                  </div>
                  {hasSourceLink && (
                    <a 
                      href={source.match(/https?:\/\/[^\s]+/)?.[0] || ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      <span>View source documentation</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : source && hasSourceLink ? (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-green-700 mb-2">Official Source</div>
                  <a 
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    <span>View source documentation</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-sm text-gray-700 mb-1">Data Unavailable</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    No specific {title.toLowerCase()} data found for 2024. Additional research may be required to obtain this information.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PlatformPartners() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [metrics, setMetrics] = useState<Record<string, PartnerMetrics>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<{
    title: string;
    value: string;
    source: string | null;
    partnerName: string;
  } | null>(null);

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
      const matchesSearch = searchTerm === "" || 
        stakeholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stakeholder.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stakeholder.products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === "all" || stakeholder.type === selectedType;
      const matchesProduct = selectedProduct === "all" || stakeholder.products.includes(selectedProduct);
      
      return matchesSearch && matchesType && matchesProduct;
    });
  }, [stakeholders, searchTerm, selectedType, selectedProduct]);

  const getProductBadgeColor = (product: string) => {
    const colors: Record<string, string> = {
      "CPQ": "bg-purple-100 text-purple-700 border-purple-200",
      "SHAED Marketplace": "bg-green-100 text-green-700 border-green-200",
      "Order Management": "bg-blue-100 text-blue-700 border-blue-200",
      "Upfit Portal": "bg-orange-100 text-orange-700 border-orange-200",
    };
    return colors[product] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const handleMetricClick = (partnerName: string, metricTitle: string, value: string, source: string | null) => {
    setDialogData({
      title: metricTitle,
      value,
      source,
      partnerName
    });
    setDialogOpen(true);
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

          {/* Results count */}
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
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-1">{stakeholder.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {stakeholder.type}
                    </Badge>
                  </div>
                  <Building2 className="h-5 w-5 text-gray-400 shrink-0" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* SHAED Products */}
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-2">SHAED Products</div>
                  <div className="flex flex-wrap gap-1.5">
                    {stakeholder.products.map((product) => (
                      <Badge 
                        key={product} 
                        variant="outline" 
                        className={`text-xs ${getProductBadgeColor(product)}`}
                      >
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                {partnerMetrics && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="text-xs font-semibold text-gray-700 mb-2">2024 METRICS</div>
                    
                    {/* Revenue */}
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Revenue</div>
                      <button
                        onClick={() => handleMetricClick(
                          stakeholder.name,
                          "Revenue",
                          partnerMetrics.revenue.rationale,
                          partnerMetrics.revenue.source
                        )}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                      >
                        {partnerMetrics.revenue.display}
                      </button>
                    </div>

                    {/* Volume */}
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Volume</div>
                      <button
                        onClick={() => handleMetricClick(
                          stakeholder.name,
                          "Volume",
                          partnerMetrics.volume.rationale,
                          partnerMetrics.volume.source
                        )}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                      >
                        {partnerMetrics.volume.display}
                      </button>
                    </div>

                    {/* Employees */}
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Employees</div>
                      <button
                        onClick={() => handleMetricClick(
                          stakeholder.name,
                          "Employees",
                          partnerMetrics.employees.rationale,
                          partnerMetrics.employees.source
                        )}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                      >
                        {partnerMetrics.employees.display}
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Metric Dialog */}
      {dialogData && (
        <MetricDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={dialogData.title}
          value={dialogData.value}
          source={dialogData.source}
          partnerName={dialogData.partnerName}
        />
      )}
    </div>
  );
}

