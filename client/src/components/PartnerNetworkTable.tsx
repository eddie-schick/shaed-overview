import { useState, useMemo, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Network, TrendingUp, ChevronLeft, ChevronRight, Filter } from "lucide-react";

interface Stakeholder {
  name: string;
  type: string;
  products: string[];
}

interface PartnerMetrics {
  revenue: { display: string };
  volume: { display: string };
  employees: { display: string };
}

interface NetworkMetrics {
  segment: string;
  product: string;
  dealers: string;
  oems: string;
  upfitters: string;
  equipment_mfg: string;
  buyers: string;
}

interface PartnerNetworkTableProps {
  stakeholders: Stakeholder[];
  metrics: Record<string, PartnerMetrics>;
  networkData: Record<string, NetworkMetrics>;
  onPartnerClick?: (partnerName: string) => void;
}

export function PartnerNetworkTable({ stakeholders, metrics, networkData, onPartnerClick }: PartnerNetworkTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPartners, setSelectedPartners] = useState<Set<string>>(new Set());
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Column filters state
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{top: number, left: number, width: number} | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get unique segments for filter
  const getUniqueSegments = (): string[] => {
    const segments = new Set<string>();
    stakeholders.forEach(stakeholder => {
      if (stakeholder.type) {
        segments.add(stakeholder.type);
      }
    });
    return Array.from(segments).sort();
  };

  // Get unique products for filter (modular - handles multiple products per partner)
  const getUniqueProducts = (): string[] => {
    const products = new Set<string>();
    stakeholders.forEach(stakeholder => {
      if (stakeholder.products) {
        stakeholder.products.forEach(product => {
          if (product.trim()) {
            products.add(product.trim());
          }
        });
      }
    });
    return Array.from(products).sort();
  };

  // Parse numeric values from metric displays (same logic as PlatformPartnersWithDialog)
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

  // Format metric display to show only numbers (same logic as PlatformPartnersWithDialog)
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

  // Parse range values (e.g., "150-300" -> take max)
  const parseRange = (val: string): number => {
    if (!val || val === "0") return 0;
    const cleaned = val.replace(/[+,]/g, '');
    if (cleaned.includes('-')) {
      const parts = cleaned.split('-');
      return parseInt(parts[1]) || 0;
    }
    return parseInt(cleaned) || 0;
  };

  // Handle column header click for debugging
  const handleHeaderClick = (column: string, event: React.MouseEvent) => {
    console.log('Header clicked:', column);
    
    if (openDropdown === column) {
      setOpenDropdown(null);
      setDropdownPosition(null);
    } else {
      // Calculate position for the dropdown
      const rect = event.currentTarget.getBoundingClientRect();
      const position = {
        top: rect.bottom + window.scrollY, // Position right at the bottom of the header
        left: rect.left + window.scrollX,
        width: rect.width
      };
      
      setDropdownPosition(position);
      setOpenDropdown(column);
    }
  };

  // Handle sorting
  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
    setOpenDropdown(null);
  };

  // Handle column filtering
  const handleColumnFilter = (column: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  // Clear column filter
  const clearColumnFilter = (column: string) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[column];
      return newFilters;
    });
  };

  // Get unique values for a column (for filter options) - using formatted display values
  const getColumnValues = (column: string): string[] => {
    const values = new Set<string>();
    
    stakeholders.forEach(stakeholder => {
      let value: string;
      
      switch (column) {
        case 'name':
          value = stakeholder.name;
          break;
        case 'type':
          value = stakeholder.type;
          break;
        case 'products':
          value = stakeholder.products?.join(", ") || "";
          break;
        case 'revenue':
          value = metrics[stakeholder.name]?.revenue?.display ? 
            formatMetricDisplay(metrics[stakeholder.name].revenue.display, 'revenue') : "N/A";
          break;
        case 'volume':
          value = metrics[stakeholder.name]?.volume?.display ? 
            formatMetricDisplay(metrics[stakeholder.name].volume.display, 'volume') : "N/A";
          break;
        case 'employees':
          value = metrics[stakeholder.name]?.employees?.display ? 
            formatMetricDisplay(metrics[stakeholder.name].employees.display, 'employees') : "N/A";
          break;
        case 'dealers':
          value = networkData[stakeholder.name]?.dealers || "0";
          break;
        case 'oems':
          value = networkData[stakeholder.name]?.oems || "0";
          break;
        case 'upfitters':
          value = networkData[stakeholder.name]?.upfitters || "0";
          break;
        case 'equipment_mfg':
          value = networkData[stakeholder.name]?.equipment_mfg || "0";
          break;
        case 'buyers':
          value = networkData[stakeholder.name]?.buyers || "0";
          break;
        default:
          value = "";
      }
      
      if (value && value !== "N/A" && value !== "0") {
        values.add(value);
      }
    });
    
    return Array.from(values).sort();
  };

  // Handle checkbox selection
  const handlePartnerSelect = (partnerName: string, checked: boolean) => {
    setSelectedPartners(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(partnerName);
      } else {
        newSet.delete(partnerName);
      }
      return newSet;
    });
  };

  // Calculate total network reach based on selected partners
  const networkStats = useMemo(() => {
    let totalDealers = 0;
    let totalOEMs = 0;
    let totalUpfitters = 0;
    let totalEquipment = 0;
    let totalBuyers = 0;

    // Use selected partners if any are selected, otherwise use all stakeholders
    const partnersToCalculate = selectedPartners.size > 0 
      ? stakeholders.filter(s => selectedPartners.has(s.name))
      : stakeholders;

    partnersToCalculate.forEach(stakeholder => {
      const network = networkData[stakeholder.name];
      if (network) {
        totalDealers += parseRange(network.dealers);
        totalOEMs += parseRange(network.oems);
        totalUpfitters += parseRange(network.upfitters);
        totalEquipment += parseRange(network.equipment_mfg);
        totalBuyers += parseRange(network.buyers);
      } else {
        // Debug: log stakeholders without network data
        console.log('Stakeholder without network data:', stakeholder.name);
      }
    });

    const totalReach = totalDealers + totalOEMs + totalUpfitters + totalEquipment + totalBuyers;

    return {
      totalDealers,
      totalOEMs,
      totalUpfitters,
      totalEquipment,
      totalBuyers,
      totalReach,
      selectedCount: selectedPartners.size
    };
  }, [stakeholders, networkData, selectedPartners]);

  // Filter and search
  const filteredStakeholders = useMemo(() => {
    let filtered = stakeholders.filter(stakeholder => {
      const matchesSearch = stakeholder.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply segment filter
      const matchesSegment = segmentFilter === "all" || stakeholder.type === segmentFilter;
      
      // Apply product filter (modular - check if any of the stakeholder's products match)
      const matchesProduct = productFilter === "all" || 
        (stakeholder.products && stakeholder.products.some(product => 
          product.trim().toLowerCase() === productFilter.toLowerCase()
        ));
      
      // Apply column filters
      const matchesFilters = Object.entries(columnFilters).every(([column, filterValue]) => {
        if (!filterValue) return true;
        
        switch (column) {
          case 'name':
            return stakeholder.name.toLowerCase().includes(filterValue.toLowerCase());
          case 'type':
            return stakeholder.type.toLowerCase().includes(filterValue.toLowerCase());
          case 'products':
            return stakeholder.products?.some(product => 
              product.toLowerCase().includes(filterValue.toLowerCase())
            ) || false;
          case 'revenue':
            const revenueValue = metrics[stakeholder.name]?.revenue?.display ? 
              formatMetricDisplay(metrics[stakeholder.name].revenue.display, 'revenue') : "N/A";
            return revenueValue.toLowerCase().includes(filterValue.toLowerCase());
          case 'volume':
            const volumeValue = metrics[stakeholder.name]?.volume?.display ? 
              formatMetricDisplay(metrics[stakeholder.name].volume.display, 'volume') : "N/A";
            return volumeValue.toLowerCase().includes(filterValue.toLowerCase());
          case 'employees':
            const employeesValue = metrics[stakeholder.name]?.employees?.display ? 
              formatMetricDisplay(metrics[stakeholder.name].employees.display, 'employees') : "N/A";
            return employeesValue.toLowerCase().includes(filterValue.toLowerCase());
          case 'dealers':
            const dealersValue = networkData[stakeholder.name]?.dealers || "0";
            return dealersValue.toLowerCase().includes(filterValue.toLowerCase());
          case 'oems':
            const oemsValue = networkData[stakeholder.name]?.oems || "0";
            return oemsValue.toLowerCase().includes(filterValue.toLowerCase());
          case 'upfitters':
            const upfittersValue = networkData[stakeholder.name]?.upfitters || "0";
            return upfittersValue.toLowerCase().includes(filterValue.toLowerCase());
          case 'equipment_mfg':
            const equipmentValue = networkData[stakeholder.name]?.equipment_mfg || "0";
            return equipmentValue.toLowerCase().includes(filterValue.toLowerCase());
          case 'buyers':
            const buyersValue = networkData[stakeholder.name]?.buyers || "0";
            return buyersValue.toLowerCase().includes(filterValue.toLowerCase());
          default:
            return true;
        }
      });
      
      return matchesSearch && matchesSegment && matchesProduct && matchesFilters;
    });

    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;
        
        switch (sortColumn) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'type':
            aValue = a.type.toLowerCase();
            bValue = b.type.toLowerCase();
            break;
          case 'products':
            aValue = a.products?.join(", ") || "";
            bValue = b.products?.join(", ") || "";
            break;
          case 'revenue':
            aValue = parseMetricValue(metrics[a.name]?.revenue?.display || "0");
            bValue = parseMetricValue(metrics[b.name]?.revenue?.display || "0");
            break;
          case 'volume':
            aValue = parseMetricValue(metrics[a.name]?.volume?.display || "0");
            bValue = parseMetricValue(metrics[b.name]?.volume?.display || "0");
            break;
          case 'employees':
            aValue = parseMetricValue(metrics[a.name]?.employees?.display || "0");
            bValue = parseMetricValue(metrics[b.name]?.employees?.display || "0");
            break;
          case 'dealers':
            aValue = parseRange(networkData[a.name]?.dealers || "0");
            bValue = parseRange(networkData[b.name]?.dealers || "0");
            break;
          case 'oems':
            aValue = parseRange(networkData[a.name]?.oems || "0");
            bValue = parseRange(networkData[b.name]?.oems || "0");
            break;
          case 'upfitters':
            aValue = parseRange(networkData[a.name]?.upfitters || "0");
            bValue = parseRange(networkData[b.name]?.upfitters || "0");
            break;
          case 'equipment_mfg':
            aValue = parseRange(networkData[a.name]?.equipment_mfg || "0");
            bValue = parseRange(networkData[b.name]?.equipment_mfg || "0");
            break;
          case 'buyers':
            aValue = parseRange(networkData[a.name]?.buyers || "0");
            bValue = parseRange(networkData[b.name]?.buyers || "0");
            break;
          default:
            return 0;
        }
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [stakeholders, searchTerm, segmentFilter, productFilter, columnFilters, sortColumn, sortDirection, metrics, networkData]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPartners(new Set(filteredStakeholders.map(s => s.name)));
    } else {
      setSelectedPartners(new Set());
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredStakeholders.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedStakeholders = filteredStakeholders.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, segmentFilter, productFilter, columnFilters, sortColumn, sortDirection, rowsPerPage]);

  const getSegmentBadgeColor = (segment: string) => {
    const colors: Record<string, string> = {
      "OEM": "bg-blue-100 text-blue-800",
      "Dealer": "bg-green-100 text-green-800",
      "2nd Stage Manufacturer/Upfitter": "bg-purple-100 text-purple-800",
      "Charging Partner": "bg-yellow-100 text-yellow-800",
      "End User": "bg-pink-100 text-pink-800",
      "Finance Partner": "bg-indigo-100 text-indigo-800",
    };
    return colors[segment] || "bg-gray-100 text-gray-800";
  };

  // Render sortable and filterable column header
  const renderColumnHeader = (column: string, title: string, className: string = "") => {
    const hasFilter = columnFilters[column];
    const columnValues = getColumnValues(column);
    
    return (
      <TableHead className={`text-center font-semibold ${className}`}>
        <div 
          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={(e) => handleHeaderClick(column, e)}
        >
          {title}
        </div>
      </TableHead>
    );
  };

  return (
    <div className="space-y-6">
      {/* Network Scale Summary Cards */}
      {selectedPartners.size > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Direct Partners</CardDescription>
              <CardTitle className="text-2xl">
                {selectedPartners.size}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Dealer Network</CardDescription>
              <CardTitle className="text-2xl">{networkStats.totalDealers.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>OEM Connections</CardDescription>
              <CardTitle className="text-2xl">{networkStats.totalOEMs.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Upfitter Network</CardDescription>
              <CardTitle className="text-2xl">{networkStats.totalUpfitters.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Equipment Mfg</CardDescription>
              <CardTitle className="text-2xl">{networkStats.totalEquipment.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Buyers</CardDescription>
              <CardTitle className="text-2xl">{networkStats.totalBuyers.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-green-50">
            <CardHeader className="pb-2">
              <CardDescription className="font-semibold">Total Network Reach</CardDescription>
              <CardTitle className="text-2xl text-green-600">{networkStats.totalReach.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Partner Network Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Partner Network Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={segmentFilter} onValueChange={setSegmentFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Segments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments ({stakeholders.length})</SelectItem>
                {getUniqueSegments().map(segment => (
                  <SelectItem key={segment} value={segment}>
                    {segment} ({stakeholders.filter(s => s.type === segment).length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products ({stakeholders.length})</SelectItem>
                {getUniqueProducts().map(product => (
                  <SelectItem key={product} value={product}>
                    {product} ({stakeholders.filter(s => s.products?.includes(product)).length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-center font-semibold w-20">
                    <div className="flex flex-col items-center gap-1">
                      <Checkbox
                        checked={filteredStakeholders.length > 0 && selectedPartners.size === filteredStakeholders.length}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all partners"
                      />
                      {selectedPartners.size > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => setSelectedPartners(new Set())}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </TableHead>
                  {renderColumnHeader('name', 'Partner Name')}
                  {renderColumnHeader('type', 'Segment')}
                  {renderColumnHeader('products', 'Product')}
                  {renderColumnHeader('revenue', '2024 Revenue')}
                  {renderColumnHeader('volume', '2024 Volume')}
                  {renderColumnHeader('employees', 'Employees')}
                  {renderColumnHeader('dealers', 'Dealers', 'bg-blue-50')}
                  {renderColumnHeader('oems', 'OEMs', 'bg-blue-50')}
                  {renderColumnHeader('upfitters', 'Upfitters', 'bg-blue-50')}
                  {renderColumnHeader('equipment_mfg', 'Equip Mfg', 'bg-blue-50')}
                  {renderColumnHeader('buyers', 'Buyers', 'bg-blue-50')}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStakeholders.map((stakeholder, idx) => {
                  const partnerMetrics = metrics[stakeholder.name];
                  const network = networkData[stakeholder.name];
                  const clickableClass = onPartnerClick ? "cursor-pointer hover:underline hover:text-blue-600 text-blue-600 transition-colors" : "";

                  return (
                    <TableRow key={idx} className="hover:bg-gray-50">
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedPartners.has(stakeholder.name)}
                          onCheckedChange={(checked) => handlePartnerSelect(stakeholder.name, checked as boolean)}
                          aria-label={`Select ${stakeholder.name}`}
                        />
                      </TableCell>
                      <TableCell className={`text-center font-medium ${clickableClass}`} onClick={() => onPartnerClick?.(stakeholder.name)}>
                        {stakeholder.name}
                      </TableCell>
                      <TableCell className={`text-center ${clickableClass}`} onClick={() => onPartnerClick?.(stakeholder.name)}>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSegmentBadgeColor(stakeholder.type)}`}>
                          {stakeholder.type}
                        </span>
                      </TableCell>
                      <TableCell className={`text-center text-sm ${clickableClass}`} onClick={() => onPartnerClick?.(stakeholder.name)}>
                        {stakeholder.products?.join(", ") || "N/A"}
                      </TableCell>
                      <TableCell className={`text-center ${clickableClass}`} onClick={() => onPartnerClick?.(stakeholder.name)}>
                        {partnerMetrics?.revenue?.display ? formatMetricDisplay(partnerMetrics.revenue.display, 'revenue') : "N/A"}
                      </TableCell>
                      <TableCell className={`text-center ${clickableClass}`} onClick={() => onPartnerClick?.(stakeholder.name)}>
                        {partnerMetrics?.volume?.display ? formatMetricDisplay(partnerMetrics.volume.display, 'volume') : "N/A"}
                      </TableCell>
                      <TableCell className={`text-center ${clickableClass}`} onClick={() => onPartnerClick?.(stakeholder.name)}>
                        {partnerMetrics?.employees?.display ? formatMetricDisplay(partnerMetrics.employees.display, 'employees') : "N/A"}
                      </TableCell>
                      <TableCell className="text-center bg-blue-50">{network?.dealers || "0"}</TableCell>
                      <TableCell className="text-center bg-blue-50">{network?.oems || "0"}</TableCell>
                      <TableCell className="text-center bg-blue-50">{network?.upfitters || "0"}</TableCell>
                      <TableCell className="text-center bg-blue-50">{network?.equipment_mfg || "0"}</TableCell>
                      <TableCell className="text-center bg-blue-50">{network?.buyers || "0"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Dropdown Portal - rendered outside table */}
          {openDropdown && dropdownPosition && (
            <div 
              ref={dropdownRef}
              className="fixed z-[9999] bg-white border border-gray-200 rounded-md shadow-lg"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: '256px'
              }}
            >
              <div className="p-2">
                <div className="text-sm font-medium text-gray-700 mb-2">Sort</div>
                <div className="space-y-1 mb-3">
                  <div 
                    className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer rounded"
                    onClick={() => handleSort(openDropdown, 'asc')}
                  >
                    Sort A-Z / Low to High
                  </div>
                  <div 
                    className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer rounded"
                    onClick={() => handleSort(openDropdown, 'desc')}
                  >
                    Sort Z-A / High to Low
                  </div>
                </div>
                
                <div className="border-t pt-2 mb-2"></div>
                
                <div className="text-sm font-medium text-gray-700 mb-2">Filter</div>
                <Input
                  placeholder={`Filter ${openDropdown.toLowerCase()}...`}
                  value={columnFilters[openDropdown] || ""}
                  onChange={(e) => handleColumnFilter(openDropdown, e.target.value)}
                  className="h-8 text-sm mb-2"
                />
                
                {getColumnValues(openDropdown).length > 0 && (
                  <>
                    <div className="text-sm font-medium text-gray-700 mb-2">Quick Filters</div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {getColumnValues(openDropdown).slice(0, 10).map((value, index) => (
                        <div 
                          key={index}
                          className="px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer rounded"
                          onClick={() => handleColumnFilter(openDropdown, value)}
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                {columnFilters[openDropdown] && (
                  <>
                    <div className="border-t pt-2 mt-2"></div>
                    <div 
                      className="px-2 py-1 text-sm text-red-600 hover:bg-gray-100 cursor-pointer rounded"
                      onClick={() => clearColumnFilter(openDropdown)}
                    >
                      Clear Filter
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <Select value={rowsPerPage.toString()} onValueChange={(val) => setRowsPerPage(parseInt(val))}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredStakeholders.length)} of {filteredStakeholders.length} partners
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
