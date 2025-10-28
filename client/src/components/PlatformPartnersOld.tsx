import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search, Filter, CheckCircle2, Clock, XCircle, Network, Package } from "lucide-react";

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

export default function PlatformPartners() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load and parse CSV data
    fetch("/stakeholders.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const lines = csvText.split("\n").filter(line => line.trim());
        const headers = lines[0].split(",");
        
        const parsed = lines.slice(1).map((line) => {
          // Handle quoted fields with commas
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
        }).filter(s => s.name); // Filter out empty rows

        setStakeholders(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading stakeholders:", err);
        setLoading(false);
      });
  }, []);

  // Get unique values for filters
  const stakeholderTypes = useMemo(() => {
    const types = new Set(stakeholders.map(s => s.type));
    return Array.from(types).sort();
  }, [stakeholders]);



  const products = useMemo(() => {
    const productSet = new Set<string>();
    stakeholders.forEach(s => s.products.forEach(p => productSet.add(p)));
    return Array.from(productSet).sort();
  }, [stakeholders]);

  // Filter stakeholders
  const filteredStakeholders = useMemo(() => {
    return stakeholders.filter((stakeholder) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        stakeholder.name.toLowerCase().includes(searchLower) ||
        stakeholder.type.toLowerCase().includes(searchLower) ||
        stakeholder.products.some(p => p.toLowerCase().includes(searchLower)) ||
        stakeholder.broughtOnBy.toLowerCase().includes(searchLower) ||
        stakeholder.comments.toLowerCase().includes(searchLower);

      // Type filter
      const matchesType = selectedType === "all" || stakeholder.type === selectedType;



      // Product filter
      const matchesProduct = selectedProduct === "all" || 
        stakeholder.products.some(p => p === selectedProduct);

      return matchesSearch && matchesType && matchesProduct;
    });
  }, [stakeholders, searchTerm, selectedType, selectedProduct]);

  // Get status icon and color
  const getStatusBadge = (status: string) => {
    if (status === "Completed") {
      return <Badge className="bg-green-100 text-green-700 border-green-300"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
    } else if (status === "In progress") {
      return <Badge className="bg-blue-100 text-blue-700 border-blue-300"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-700 border-gray-300"><XCircle className="w-3 h-3 mr-1" />Not Started</Badge>;
    }
  };

  // Get product badge color
  const getProductBadge = (product: string) => {
    const colors: Record<string, string> = {
      "CPQ": "bg-purple-100 text-purple-700 border-purple-300",
      "SHAED Marketplace": "bg-green-100 text-green-700 border-green-300",
      "Order Management": "bg-blue-100 text-blue-700 border-blue-300",
      "Upfit Portal": "bg-orange-100 text-orange-700 border-orange-300",
    };
    return colors[product] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    if (type === "OEM") return "🏭";
    if (type === "Dealer") return "🏪";
    if (type.includes("Upfitter") || type.includes("Manufacturer")) return "🔧";
    if (type === "Charging Partner") return "⚡";
    if (type === "End-User") return "👤";
    if (type === "Finance Partner") return "💰";
    return "🏢";
  };

  // Statistics
  const stats = useMemo(() => {
    const total = filteredStakeholders.length;
    return { total };
  }, [filteredStakeholders]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading platform partners...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Stakeholder Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {stakeholderTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {getTypeIcon(type)} {type}
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
                <SelectItem value="all">All Products</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product} value={product}>
                    {product}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredStakeholders.length}</span> of{" "}
          <span className="font-semibold text-foreground">{stakeholders.length}</span> partners
        </p>
        {(searchTerm || selectedType !== "all" || selectedProduct !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedType("all");
              setSelectedProduct("all");
            }}
            className="text-sm text-primary hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Stakeholders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredStakeholders.map((stakeholder, idx) => (
          <Card key={idx} className="hover:border-green-300 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{stakeholder.name}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {stakeholder.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* SHAED Products */}
              {stakeholder.products.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">SHAED Products:</p>
                  <div className="flex flex-wrap gap-2">
                    {stakeholder.products.map((product, pIdx) => (
                      <Badge key={pIdx} className={getProductBadge(product)}>
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}




            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredStakeholders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No partners found matching your filters.</p>
            <button
              onClick={() => {
              setSearchTerm("");
              setSelectedType("all");
              setSelectedProduct("all");
              }}
              className="text-sm text-primary hover:underline mt-2"
            >
              Clear all filters
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

