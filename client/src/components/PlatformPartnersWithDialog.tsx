import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Building2, Search, Filter, Info, ExternalLink, DollarSign, Users, Package } from "lucide-react";

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
  rationale: string;
  source: string | null;
  partnerName: string;
}

function MetricDialog({ open, onOpenChange, title, value, rationale, source, partnerName }: MetricDialogProps) {
  const isEstimate = rationale && (
    rationale.toLowerCase().includes('estimate') || 
    rationale.toLowerCase().includes('based on') ||
    rationale.toLowerCase().includes('no specific') ||
    rationale.toLowerCase().includes('likely') ||
    !source || !source.startsWith('http')
  );

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
                <div>
                  <div className="font-semibold text-sm text-amber-700 mb-1">Estimated Value</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {rationale}
                  </div>
                  {source && source.startsWith('http') && (
                    <a 
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors mt-2"
                    >
                      <span>View source</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : source ? (
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

interface PlatformPartnersProps {
  highlightPartner?: string | null;
  onHighlightComplete?: () => void;
}

export default function PlatformPartners({ highlightPartner, onHighlightComplete }: PlatformPartnersProps) {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [metrics, setMetrics] = useState<Record<string, PartnerMetrics>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [revenueRange, setRevenueRange] = useState<[number, number]>([0, 1000000000]);
  const [volumeRange, setVolumeRange] = useState<[number, number]>([0, 1000000]);
  const [employeesRange, setEmployeesRange] = useState<[number, number]>([0, 200000]);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<{
    title: string;
    value: string;
    rationale: string;
    source: string | null;
    partnerName: string;
  } | null>(null);

  // Parse numeric values from metric displays
  const parseMetricValue = (display: string): number => {
    if (!display || display === "N/A") return 0;
    
    // Extract the numeric value and multiplier
    const cleaned = display.trim();
    
    // Handle ranges like "$2-3M" or "$2-3 million" (take the max value)
    const rangePattern = /^[€$]?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*-\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(million|billion|thousand|k|m|b|K|M|B)?/i;
    const rangeMatch = cleaned.match(rangePattern);
    
    if (rangeMatch) {
      const minValue = parseFloat(rangeMatch[1].replace(/,/g, ''));
      const maxValue = parseFloat(rangeMatch[2].replace(/,/g, ''));
      const unit = rangeMatch[3] ? rangeMatch[3].toLowerCase() : '';
      
      // Apply multiplier based on unit
      let multiplier = 1;
      if (unit === 'billion' || unit === 'b') {
        multiplier = 1000000000;
      } else if (unit === 'million' || unit === 'm') {
        multiplier = 1000000;
      } else if (unit === 'thousand' || unit === 'k') {
        multiplier = 1000;
      }
      
      // Return the maximum value from the range
      return Math.max(minValue, maxValue) * multiplier;
    }
    
    // Match patterns like "$2.5 billion", "5.0K", "373,000 vehicles", "248,243 (Stellantis)", "€54,077 million", etc.
    const pattern = /^[€$]?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(million|billion|thousand|k|m|b|K|M|B)/i;
    const match = cleaned.match(pattern);
    
    if (match) {
      const numericValue = parseFloat(match[1].replace(/,/g, ''));
      const unit = match[2].toLowerCase();
      
      // Apply multiplier based on unit
      if (unit === 'billion' || unit === 'b') {
        return numericValue * 1000000000;
      } else if (unit === 'million' || unit === 'm') {
        return numericValue * 1000000;
      } else if (unit === 'thousand' || unit === 'k') {
        return numericValue * 1000;
      }
    }
    
    // If no unit multiplier, extract the first number (including comma-separated numbers)
    const numberMatch = cleaned.match(/(\d+(?:,\d{3})*(?:\.\d+)?)/);
    if (numberMatch) {
      return parseFloat(numberMatch[1].replace(/,/g, ''));
    }
    
    return 0;
  };

  // Format metric display to show only numbers
  const formatMetricDisplay = (display: string, type: 'revenue' | 'volume' | 'employees'): string => {
    if (!display || display === "N/A") return "N/A";
    
    // Check if it's a range format like "$2-3M"
    const cleaned = display.trim();
    const rangePattern = /^[€$]?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*-\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(million|billion|thousand|k|m|b|K|M|B)?/i;
    const rangeMatch = cleaned.match(rangePattern);
    
    if (rangeMatch) {
      const minValue = parseFloat(rangeMatch[1].replace(/,/g, ''));
      const maxValue = parseFloat(rangeMatch[2].replace(/,/g, ''));
      const unit = rangeMatch[3] ? rangeMatch[3].toLowerCase() : '';
      
      if (type === 'revenue') {
        return `$${minValue}M-$${maxValue}M`;
      } else if (type === 'volume') {
        if (unit === 'm' || unit === 'million') {
          return `${minValue}M-${maxValue}M`;
        } else if (unit === 'k' || unit === 'thousand') {
          return `${minValue}K-${maxValue}K`;
        }
        return `${minValue}-${maxValue}`;
      } else { // employees
        return `${minValue}-${maxValue}`;
      }
    }
    
    const numericValue = parseMetricValue(display);
    
    // Check if original display had Euro symbol
    const hasEuro = cleaned.startsWith('€');
    
    if (type === 'revenue') {
      if (numericValue >= 1000000000) {
        return `${hasEuro ? '€' : '$'}${(numericValue / 1000000000).toFixed(1)}B`;
      } else if (numericValue >= 1000000) {
        return `${hasEuro ? '€' : '$'}${(numericValue / 1000000).toFixed(1)}M`;
      } else if (numericValue >= 1000) {
        return `${hasEuro ? '€' : '$'}${(numericValue / 1000).toFixed(1)}K`;
      } else {
        return `${hasEuro ? '€' : '$'}${numericValue.toFixed(0)}`;
      }
    } else if (type === 'volume') {
      if (numericValue >= 1000000) {
        return `${(numericValue / 1000000).toFixed(1)}M`;
      } else if (numericValue >= 1000) {
        return `${(numericValue / 1000).toFixed(1)}K`;
      } else {
        return numericValue.toFixed(0);
      }
    } else { // employees
      if (numericValue >= 1000) {
        return `${(numericValue / 1000).toFixed(1)}K`;
      } else {
        return numericValue.toFixed(0);
      }
    }
  };

  useEffect(() => {
    // Load stakeholders CSV and metrics JSON with retry logic
    const fetchWithRetry = async (url: string, retries = 3): Promise<Response> => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url + '?v=' + Date.now());
          if (response.ok) return response;
          console.warn(`Fetch attempt ${i + 1} failed for ${url}:`, response.status);
        } catch (error) {
          console.warn(`Fetch attempt ${i + 1} error for ${url}:`, error);
          if (i === retries - 1) throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
      throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
    };

    Promise.all([
      fetchWithRetry("/stakeholders.csv").then(res => res.text()),
      fetchWithRetry("/partner-metrics.json").then(res => res.json())
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

        // Remove duplicate Endera entries - keep the more recent one (End-User)
        const uniqueStakeholders = parsed.reduce((acc, current) => {
          const existing = acc.find(item => item.name === current.name);
          if (existing) {
            // Keep the more recent entry (End-User with Order Management)
            if (current.type === "End-User" && current.products.includes("Order Management")) {
              const index = acc.findIndex(item => item.name === current.name);
              acc[index] = current;
            }
          } else {
            acc.push(current);
          }
          return acc;
        }, [] as Stakeholder[]);

        setStakeholders(uniqueStakeholders);
        setMetrics(metricsData);
        
        // Initialize slider ranges after data loads
        const revenues: number[] = [];
        const volumes: number[] = [];
        const employees: number[] = [];

        uniqueStakeholders.forEach(stakeholder => {
          const partnerMetrics = metricsData[stakeholder.name];
          if (partnerMetrics) {
            const revenue = parseMetricValue(partnerMetrics.revenue.display);
            const volume = parseMetricValue(partnerMetrics.volume.display);
            const employee = parseMetricValue(partnerMetrics.employees.display);
            
            revenues.push(revenue);
            volumes.push(volume);
            employees.push(employee);
          }
        });

        if (revenues.length > 0) {
          setRevenueRange([Math.min(...revenues), Math.max(...revenues)]);
        }
        if (volumes.length > 0) {
          setVolumeRange([Math.min(...volumes), Math.max(...volumes)]);
        }
        if (employees.length > 0) {
          setEmployeesRange([Math.min(...employees), Math.max(...employees)]);
        }
        
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        console.error("Failed to load partner metrics. Please check:");
        console.error("1. /partner-metrics.json is accessible");
        console.error("2. /stakeholders.csv is accessible");
        console.error("3. Network connectivity");
        alert("Failed to load partner data. Please refresh the page or contact support.");
        setLoading(false);
      });
  }, []);

  // Handle partner highlighting from network tab
  useEffect(() => {
    if (highlightPartner) {
      setSearchTerm(highlightPartner);
      setSelectedType("all");
      setSelectedProduct("all");
      
      // Clear highlight after a short delay
      const timer = setTimeout(() => {
        onHighlightComplete?.();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [highlightPartner, onHighlightComplete]);

  // Calculate ranges for sliders
  const metricRanges = useMemo(() => {
    const revenues: number[] = [];
    const volumes: number[] = [];
    const employees: number[] = [];

    stakeholders.forEach(stakeholder => {
      const partnerMetrics = metrics[stakeholder.name];
      if (partnerMetrics) {
        revenues.push(parseMetricValue(partnerMetrics.revenue.display));
        volumes.push(parseMetricValue(partnerMetrics.volume.display));
        employees.push(parseMetricValue(partnerMetrics.employees.display));
      }
    });

    return {
      revenue: { min: Math.min(...revenues), max: Math.max(...revenues) },
      volume: { min: Math.min(...volumes), max: Math.max(...volumes) },
      employees: { min: Math.min(...employees), max: Math.max(...employees) }
    };
  }, [stakeholders, metrics]);

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
      
      // Metric range filters
      const partnerMetrics = metrics[stakeholder.name];
      let matchesRevenue = true;
      let matchesVolume = true;
      let matchesEmployees = true;

      if (partnerMetrics) {
        const revenue = parseMetricValue(partnerMetrics.revenue.display);
        const volume = parseMetricValue(partnerMetrics.volume.display);
        const employees = parseMetricValue(partnerMetrics.employees.display);

        matchesRevenue = revenue >= revenueRange[0] && revenue <= revenueRange[1];
        matchesVolume = volume >= volumeRange[0] && volume <= volumeRange[1];
        matchesEmployees = employees >= employeesRange[0] && employees <= employeesRange[1];
      }
      
      return matchesSearch && matchesType && matchesProduct && matchesRevenue && matchesVolume && matchesEmployees;
    });
  }, [stakeholders, searchTerm, selectedType, selectedProduct, revenueRange, volumeRange, employeesRange, metrics]);

  const getProductBadgeColor = (product: string) => {
    const colors: Record<string, string> = {
      "CPQ": "bg-purple-100 text-purple-700 border-purple-200",
      "SHAED Marketplace": "bg-green-100 text-green-700 border-green-200",
      "Order Management": "bg-blue-100 text-blue-700 border-blue-200",
      "Upfit Portal": "bg-orange-100 text-orange-700 border-orange-200",
    };
    return colors[product] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const handleMetricClick = (partnerName: string, metricTitle: string, value: string, rationale: string, source: string | null) => {
    setDialogData({
      title: metricTitle,
      value,
      rationale,
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

          {/* Metric Range Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t">
            {/* Revenue Slider */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Revenue Range</span>
              </div>
              <Slider
                value={revenueRange}
                onValueChange={setRevenueRange}
                min={metricRanges.revenue.min}
                max={metricRanges.revenue.max}
                step={1000000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>${(revenueRange[0] / 1000000).toFixed(1)}M</span>
                <span>${(revenueRange[1] / 1000000).toFixed(1)}M</span>
              </div>
            </div>

            {/* Volume Slider */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Volume Range</span>
              </div>
              <Slider
                value={volumeRange}
                onValueChange={setVolumeRange}
                min={metricRanges.volume.min}
                max={metricRanges.volume.max}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>{volumeRange[0].toLocaleString()}</span>
                <span>{volumeRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Employees Slider */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Employees Range</span>
              </div>
              <Slider
                value={employeesRange}
                onValueChange={setEmployeesRange}
                min={metricRanges.employees.min}
                max={metricRanges.employees.max}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>{employeesRange[0].toLocaleString()}</span>
                <span>{employeesRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedType !== "all" || selectedProduct !== "all" || 
            revenueRange[0] > metricRanges.revenue.min || revenueRange[1] < metricRanges.revenue.max ||
            volumeRange[0] > metricRanges.volume.min || volumeRange[1] < metricRanges.volume.max ||
            employeesRange[0] > metricRanges.employees.min || employeesRange[1] < metricRanges.employees.max) && (
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
              {(revenueRange[0] > metricRanges.revenue.min || revenueRange[1] < metricRanges.revenue.max) && (
                <Badge variant="secondary" className="gap-1">
                  Revenue: ${(revenueRange[0] / 1000000).toFixed(1)}M - ${(revenueRange[1] / 1000000).toFixed(1)}M
                  <button onClick={() => setRevenueRange([metricRanges.revenue.min, metricRanges.revenue.max])} className="ml-1 hover:text-red-600">×</button>
                </Badge>
              )}
              {(volumeRange[0] > metricRanges.volume.min || volumeRange[1] < metricRanges.volume.max) && (
                <Badge variant="secondary" className="gap-1">
                  Volume: {volumeRange[0].toLocaleString()} - {volumeRange[1].toLocaleString()}
                  <button onClick={() => setVolumeRange([metricRanges.volume.min, metricRanges.volume.max])} className="ml-1 hover:text-red-600">×</button>
                </Badge>
              )}
              {(employeesRange[0] > metricRanges.employees.min || employeesRange[1] < metricRanges.employees.max) && (
                <Badge variant="secondary" className="gap-1">
                  Employees: {employeesRange[0].toLocaleString()} - {employeesRange[1].toLocaleString()}
                  <button onClick={() => setEmployeesRange([metricRanges.employees.min, metricRanges.employees.max])} className="ml-1 hover:text-red-600">×</button>
                </Badge>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("all");
                  setSelectedProduct("all");
                  setRevenueRange([metricRanges.revenue.min, metricRanges.revenue.max]);
                  setVolumeRange([metricRanges.volume.min, metricRanges.volume.max]);
                  setEmployeesRange([metricRanges.employees.min, metricRanges.employees.max]);
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
          const isHighlighted = highlightPartner === stakeholder.name;
          
          return (
            <Card 
              key={stakeholder.name} 
              className={`hover:shadow-lg transition-all ${
                isHighlighted ? 'ring-4 ring-blue-500 shadow-xl scale-105' : ''
              }`}
            >
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
                          partnerMetrics.revenue.display,
                          partnerMetrics.revenue.rationale,
                          partnerMetrics.revenue.source
                        )}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                      >
                        {formatMetricDisplay(partnerMetrics.revenue.display, 'revenue')}
                      </button>
                    </div>

                    {/* Volume */}
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Volume</div>
                      <button
                        onClick={() => handleMetricClick(
                          stakeholder.name,
                          "Volume",
                          partnerMetrics.volume.display,
                          partnerMetrics.volume.rationale,
                          partnerMetrics.volume.source
                        )}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                      >
                        {formatMetricDisplay(partnerMetrics.volume.display, 'volume')}
                      </button>
                    </div>

                    {/* Employees */}
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Employees</div>
                      <button
                        onClick={() => handleMetricClick(
                          stakeholder.name,
                          "Employees",
                          partnerMetrics.employees.display,
                          partnerMetrics.employees.rationale,
                          partnerMetrics.employees.source
                        )}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                      >
                        {formatMetricDisplay(partnerMetrics.employees.display, 'employees')}
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
          rationale={dialogData.rationale}
          source={dialogData.source}
          partnerName={dialogData.partnerName}
        />
      )}
    </div>
  );
}

