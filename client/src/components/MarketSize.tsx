import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DollarSign, TrendingUp, Users, Package, Building2, MousePointer, Edit3, X } from "lucide-react";

interface SubscriptionModel {
  description: string;
  model: 'subscription';
  monthlyRevenue: number;
  annualRevenue: number;
  shaedLtv: number;
  networkLtv: number;
  marketSize: string;
  marketVolume: string;
  employees: string;
  clickable: boolean;
  details: {
    [key: string]: {
      cost: number;
      description: string;
    };
  };
}

interface TransactionalModel {
  description: string;
  model: 'transactional';
  sellingPrice: number;
  referralFee: number;
  volume: number;
  shaedLtv: number;
  networkLtv: number;
  marketSize: string;
  marketVolume: string;
  employees: string;
  clickable: boolean;
}

type BusinessModelSegment = SubscriptionModel | TransactionalModel;

interface EcosystemSegment {
  id: string;
  name: string;
  description: string;
  shaedLtv: number;
  networkLtv: number;
  globalRevenue2024: {
    value: number;
    display: string;
    source: string | null;
    sourceType: "direct" | "estimated";
    methodology: string | null;
    note: string;
  };
  globalVolume2024: {
    value: number;
    display: string;
    source: string | null;
    sourceType: "direct" | "estimated";
    methodology: string | null;
    note: string;
  };
  globalEmployees2024: {
    value: number;
    display: string;
    source: string | null;
    sourceType: "direct" | "estimated";
    methodology: string | null;
    note: string;
  };
  usRevenue2024: {
    value: number;
    display: string;
    source: string | null;
    sourceType: "direct" | "estimated";
    methodology: string | null;
    note: string;
  };
  usVolume2024: {
    value: number;
    display: string;
    source: string | null;
    sourceType: "direct" | "estimated";
    methodology: string | null;
    note: string;
  };
  usEmployees2024: {
    value: number;
    display: string;
    source: string | null;
    sourceType: "direct" | "estimated";
    methodology: string | null;
    note: string;
  };
}



export default function MarketSize() {
  const [segments, setSegments] = useState<EcosystemSegment[]>([]);
  const [showDealerTechDialog, setShowDealerTechDialog] = useState(false);
  const [showSegmentDialog, setShowSegmentDialog] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string>('');
  const [editableValues, setEditableValues] = useState<{[key: string]: {sellingPrice: number, referralFee: number}}>({});
  const [selectedBottomUpSegments, setSelectedBottomUpSegments] = useState<Set<string>>(new Set(['Dealership']));
  const [regionMode, setRegionMode] = useState<'us' | 'global'>('us');
  const [marketShare, setMarketShare] = useState<number>(100); // Default 100% market share
  const [selectedTechStack, setSelectedTechStack] = useState<Set<string>>(new Set([
    'DMS', 'CRM', 'Inventory Management', 'Digital Retailing', 
    'Service/Repair Tools', 'Website Platforms', 'Marketing Tools', 'F&I Systems'
  ]));

  useEffect(() => {
    fetch("/ecosystem-analysis-enhanced.json")
      .then((res) => res.json())
      .then((data) => {
        setSegments(data.segments);
      })
      .catch((err) => {
        console.error("Error loading ecosystem data:", err);
      });
  }, []);

  const handleSegmentClick = (segmentName: string) => {
    setSelectedSegment(segmentName);
    if (segmentName === 'Dealership') {
      setShowDealerTechDialog(true);
    } else {
      setShowSegmentDialog(true);
    }
  };

  const updateEditableValue = (segment: string, field: 'sellingPrice' | 'referralFee', value: number) => {
    setEditableValues(prev => ({
      ...prev,
      [segment]: {
        ...prev[segment],
        [field]: value
      }
    }));
  };

  const getEditableValue = (segment: string, field: 'sellingPrice' | 'referralFee', defaultValue: number) => {
    return editableValues[segment]?.[field] ?? defaultValue;
  };

  const calculateTransactionalRevenue = (segment: string) => {
    const data = shaedBusinessModel[segment];
    if (!data || data.model !== 'transactional') return 0;
    
    const sellingPrice = getEditableValue(segment, 'sellingPrice', data.sellingPrice);
    const referralFee = getEditableValue(segment, 'referralFee', data.referralFee);
    const volume = getSegmentVolume(segment);
    const marketShareDecimal = marketShare / 100; // Convert percentage to decimal
    
    return volume * sellingPrice * referralFee * marketShareDecimal;
  };

  const handleBottomUpSegmentToggle = (segment: string) => {
    const newSelected = new Set(selectedBottomUpSegments);
    if (newSelected.has(segment)) {
      newSelected.delete(segment);
    } else {
      newSelected.add(segment);
    }
    setSelectedBottomUpSegments(newSelected);
  };

  const handleTechStackToggle = (item: string) => {
    const newSelected = new Set(selectedTechStack);
    if (newSelected.has(item)) {
      newSelected.delete(item);
    } else {
      newSelected.add(item);
    }
    setSelectedTechStack(newSelected);
  };

  const calculateSelectedTechStackCost = () => {
    const dealershipData = shaedBusinessModel['Dealership'];
    if (dealershipData.model === 'subscription') {
      let totalCost = 0;
      Object.entries(dealershipData.details).forEach(([item, data]) => {
        if (selectedTechStack.has(item)) {
          totalCost += data.cost;
        }
      });
      return totalCost;
    }
    return 0;
  };

  const calculateBottomUpRevenue = () => {
    let totalRevenue = 0;
    selectedBottomUpSegments.forEach(segment => {
      const data = shaedBusinessModel[segment];
      if (data) {
        if (data.model === 'subscription') {
          // For dealerships, use the dynamic calculation
          if (segment === 'Dealership') {
            totalRevenue += getDealerRevenue();
          } else {
            totalRevenue += data.annualRevenue;
          }
        } else if (data.model === 'transactional') {
          totalRevenue += calculateTransactionalRevenue(segment);
        }
      }
    });
    return totalRevenue;
  };

  const calculateSegmentKPIs = () => {
    const kpis: {[key: string]: {volume: number, asp: number, referralFee: number, revenue: number}} = {};
    
    selectedBottomUpSegments.forEach(segment => {
      const data = shaedBusinessModel[segment];
      if (data && data.model === 'transactional') {
        const baseVolume = getSegmentVolume(segment);
        const marketShareDecimal = marketShare / 100;
        const adjustedVolume = baseVolume * marketShareDecimal; // Apply market share to volume
        const asp = getEditableValue(segment, 'sellingPrice', data.sellingPrice);
        const referralFee = getEditableValue(segment, 'referralFee', data.referralFee);
        const revenue = calculateTransactionalRevenue(segment);
        
        kpis[segment] = {
          volume: adjustedVolume,
          asp,
          referralFee: referralFee * 100, // Convert to percentage
          revenue
        };
      }
    });
    
    return kpis;
  };

  const calculateDealerKPIs = () => {
    if (!selectedBottomUpSegments.has('Dealership')) return null;
    
    const dealerCount = getDealerCount();
    const marketShareDecimal = marketShare / 100;
    const adjustedDealerCount = Math.round(dealerCount * marketShareDecimal); // Round to whole dealers
    const selectedTechStackCost = calculateSelectedTechStackCost();
    const annualRevenuePerDealer = selectedTechStackCost * 12; // Monthly to annual
    const totalDealerRevenue = annualRevenuePerDealer * adjustedDealerCount;
    
    return {
      totalDealers: dealerCount,
      adjustedDealers: adjustedDealerCount,
      monthlyCostPerDealer: selectedTechStackCost,
      annualRevenuePerDealer,
      totalRevenue: totalDealerRevenue,
      selectedItems: selectedTechStack.size,
      totalItems: Object.keys(shaedBusinessModel['Dealership'].details).length
    };
  };

  const getDealerCount = () => {
    return regionMode === 'us' ? 20755 : 35000; // US: 20,755 dealers, Global: 35K dealers
  };

  const getDealerRevenue = () => {
    const dealerCount = getDealerCount();
    const marketShareDecimal = marketShare / 100; // Convert percentage to decimal
    const adjustedDealerCount = Math.round(dealerCount * marketShareDecimal); // Round to whole dealers
    const selectedTechStackCost = calculateSelectedTechStackCost();
    const annualRevenuePerDealer = selectedTechStackCost * 12; // Monthly to annual
    return annualRevenuePerDealer * adjustedDealerCount;
  };

  const getSegmentVolume = (segmentName: string): number => {
    const segment = segments.find(s => s.name === segmentName);
    if (segment) {
      return regionMode === 'us' ? segment.usVolume2024.value : segment.globalVolume2024.value;
    }
    // Fallback to hardcoded values if segment not found
    const businessModelSegment = shaedBusinessModel[segmentName];
    return businessModelSegment && businessModelSegment.model === 'transactional' ? businessModelSegment.volume : 0;
  };


  // SHAED Business Model Data (Bottom Up) - All Segments with Transactional Model
  const shaedBusinessModel: {[key: string]: BusinessModelSegment} = {
    'Dealership': {
      description: 'Subscription-based technology platform for dealerships',
      model: 'subscription',
      monthlyRevenue: 18700, // $18.7K/month from current tech stack
      annualRevenue: 224000, // $224K/year
      shaedLtv: 641250,
      networkLtv: 46200836,
      marketSize: '$1.37T',
      marketVolume: '20,755 dealerships',
      employees: '1.26M employees',
      clickable: true,
      details: {
        'DMS': { cost: 8500, description: 'Dealer Management System' },
        'CRM': { cost: 2500, description: 'Customer Relationship Management' },
        'Inventory Management': { cost: 2100, description: 'Inventory tracking and management' },
        'Digital Retailing': { cost: 1500, description: 'Online sales platform' },
        'Service/Repair Tools': { cost: 1300, description: 'Service management software' },
        'Website Platforms': { cost: 1700, description: 'Dealer website and hosting' },
        'Marketing Tools': { cost: 800, description: 'Digital marketing automation' },
        'F&I Systems': { cost: 500, description: 'Finance and insurance tools' }
      }
    },
    'End User': {
      description: 'Transactional fees for end user services',
      model: 'transactional',
      sellingPrice: 75000,
      referralFee: 0.008, // 0.8%
      volume: 1000000, // Estimated volume
      shaedLtv: 500000,
      networkLtv: 30000000,
      marketSize: '$75B',
      marketVolume: '1M transactions',
      employees: '500K employees',
      clickable: true
    },
    'Government Agency': {
      description: 'Transactional fees for government services',
      model: 'transactional',
      sellingPrice: 75000,
      referralFee: 0.008, // 0.8%
      volume: 50000,
      shaedLtv: 600000,
      networkLtv: 35000000,
      marketSize: '$3.75B',
      marketVolume: '50K transactions',
      employees: '25K employees',
      clickable: true
    },
    'OEM': {
      description: 'Transactional fees for OEM services',
      model: 'transactional',
      sellingPrice: 40000,
      referralFee: 0.03, // 3.0%
      volume: 200000,
      shaedLtv: 800000,
      networkLtv: 50000000,
      marketSize: '$8B',
      marketVolume: '200K transactions',
      employees: '100K employees',
      clickable: true
    },
    'Dealer Group': {
      description: 'Transactional fees for dealer group services',
      model: 'transactional',
      sellingPrice: 75000,
      referralFee: 0.008, // 0.8%
      volume: 100000,
      shaedLtv: 700000,
      networkLtv: 40000000,
      marketSize: '$7.5B',
      marketVolume: '100K transactions',
      employees: '50K employees',
      clickable: true
    },
    'Fleet Management Company': {
      description: 'Transactional fees for fleet management services',
      model: 'transactional',
      sellingPrice: 12500,
      referralFee: 0.035, // 3.5%
      volume: 4500000,
      shaedLtv: 775000,
      networkLtv: 52264961,
      marketSize: '$56.25B',
      marketVolume: '4.5M transactions',
      employees: '89.2K employees',
      clickable: true
    },
    'Equipment Manufacturer': {
      description: 'Transactional fees for equipment manufacturing',
      model: 'transactional',
      sellingPrice: 40000,
      referralFee: 0.070, // 7.0%
      volume: 300000,
      shaedLtv: 750000,
      networkLtv: 45000000,
      marketSize: '$12B',
      marketVolume: '300K transactions',
      employees: '75K employees',
      clickable: true
    },
    'Upfitter': {
      description: 'Transactional fees for upfitting services',
      model: 'transactional',
      sellingPrice: 25000,
      referralFee: 0.070, // 7.0%
      volume: 400000,
      shaedLtv: 650000,
      networkLtv: 38000000,
      marketSize: '$10B',
      marketVolume: '400K transactions',
      employees: '60K employees',
      clickable: true
    },
    'Logistics': {
      description: 'Transactional fees for logistics services',
      model: 'transactional',
      sellingPrice: 5000,
      referralFee: 0.07, // 7.0%
      volume: 2000000,
      shaedLtv: 550000,
      networkLtv: 32000000,
      marketSize: '$10B',
      marketVolume: '2M transactions',
      employees: '80K employees',
      clickable: true
    },
    'Traditional Finance Provider': {
      description: 'Transactional fees for traditional financing',
      model: 'transactional',
      sellingPrice: 75000,
      referralFee: 0.008, // 0.8%
      volume: 200000,
      shaedLtv: 900000,
      networkLtv: 60000000,
      marketSize: '$15B',
      marketVolume: '200K transactions',
      employees: '40K employees',
      clickable: true
    },
    'Insurance Provider': {
      description: 'Transactional fees for insurance services',
      model: 'transactional',
      sellingPrice: 5000,
      referralFee: 0.035, // 3.5%
      volume: 1500000,
      shaedLtv: 500000,
      networkLtv: 28000000,
      marketSize: '$7.5B',
      marketVolume: '1.5M transactions',
      employees: '35K employees',
      clickable: true
    },
    'Maintenance Provider': {
      description: 'Transactional fees for maintenance services',
      model: 'transactional',
      sellingPrice: 3000,
      referralFee: 0.035, // 3.5%
      volume: 3000000,
      shaedLtv: 450000,
      networkLtv: 25000000,
      marketSize: '$9B',
      marketVolume: '3M transactions',
      employees: '45K employees',
      clickable: true
    },
    'Channel Partner': {
      description: 'Transactional fees for channel partner services',
      model: 'transactional',
      sellingPrice: 15000,
      referralFee: 0.035, // 3.5%
      volume: 500000,
      shaedLtv: 600000,
      networkLtv: 35000000,
      marketSize: '$7.5B',
      marketVolume: '500K transactions',
      employees: '30K employees',
      clickable: true
    },
    'Remarketing Specialists': {
      description: 'Transactional fees for remarketing services',
      model: 'transactional',
      sellingPrice: 20000,
      referralFee: 0.035, // 3.5%
      volume: 250000,
      shaedLtv: 650000,
      networkLtv: 38000000,
      marketSize: '$5B',
      marketVolume: '250K transactions',
      employees: '25K employees',
      clickable: true
    },
    'Technology Solutions': {
      description: 'Transactional fees for technology solutions',
      model: 'transactional',
      sellingPrice: 20000,
      referralFee: 0.035, // 3.5%
      volume: 300000,
      shaedLtv: 700000,
      networkLtv: 42000000,
      marketSize: '$6B',
      marketVolume: '300K transactions',
      employees: '40K employees',
      clickable: true
    },
    'Charging OEM': {
      description: 'Transactional fees for charging OEM services',
      model: 'transactional',
      sellingPrice: 15000,
      referralFee: 0.035, // 3.5%
      volume: 200000,
      shaedLtv: 600000,
      networkLtv: 35000000,
      marketSize: '$3B',
      marketVolume: '200K transactions',
      employees: '20K employees',
      clickable: true
    },
    'Charging as a Service': {
      description: 'Transactional fees for charging as a service',
      model: 'transactional',
      sellingPrice: 1000000,
      referralFee: 0.008, // 0.8%
      volume: 5000,
      shaedLtv: 1200000,
      networkLtv: 80000000,
      marketSize: '$5B',
      marketVolume: '5K transactions',
      employees: '15K employees',
      clickable: true
    },
    'EPC': {
      description: 'Transactional fees for EPC services',
      model: 'transactional',
      sellingPrice: 100000,
      referralFee: 0.020, // 2.0%
      volume: 10000,
      shaedLtv: 1000000,
      networkLtv: 70000000,
      marketSize: '$1B',
      marketVolume: '10K transactions',
      employees: '8K employees',
      clickable: true
    },
    'Depot': {
      description: 'Transactional fees for depot services',
      model: 'transactional',
      sellingPrice: 12500,
      referralFee: 0.035, // 3.5%
      volume: 800000,
      shaedLtv: 550000,
      networkLtv: 32000000,
      marketSize: '$10B',
      marketVolume: '800K transactions',
      employees: '50K employees',
      clickable: true
    },
    'Utility Provider': {
      description: 'Transactional fees for utility services',
      model: 'transactional',
      sellingPrice: 20000,
      referralFee: 0.035, // 3.5%
      volume: 150000,
      shaedLtv: 650000,
      networkLtv: 38000000,
      marketSize: '$3B',
      marketVolume: '150K transactions',
      employees: '20K employees',
      clickable: true
    },
    'Grant Administrator': {
      description: 'Transactional fees for grant administration',
      model: 'transactional',
      sellingPrice: 20000,
      referralFee: 0.035, // 3.5%
      volume: 50000,
      shaedLtv: 600000,
      networkLtv: 35000000,
      marketSize: '$1B',
      marketVolume: '50K transactions',
      employees: '10K employees',
      clickable: true
    },
    'EV Finance Provider': {
      description: 'Transactional fees for EV financing',
      model: 'transactional',
      sellingPrice: 150000,
      referralFee: 0.008, // 0.8%
      volume: 100000,
      shaedLtv: 1100000,
      networkLtv: 75000000,
      marketSize: '$15B',
      marketVolume: '100K transactions',
      employees: '25K employees',
      clickable: true
    },
    'Operating and Maintenance Provider': {
      description: 'Transactional fees for operating and maintenance',
      model: 'transactional',
      sellingPrice: 50000,
      referralFee: 0.020, // 2.0%
      volume: 200000,
      shaedLtv: 800000,
      networkLtv: 50000000,
      marketSize: '$10B',
      marketVolume: '200K transactions',
      employees: '30K employees',
      clickable: true
    }
  };




  return (
    <div className="space-y-6">

      {/* Region Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Market Region</CardTitle>
          <CardDescription>
            Choose between US market analysis or Global market analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={regionMode} onValueChange={(value) => setRegionMode(value as 'us' | 'global')}>
            <TabsList className="grid w-full grid-cols-2 max-w-xs">
              <TabsTrigger value="us">US Market</TabsTrigger>
              <TabsTrigger value="global">Global Market</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Market Share Slider */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Market Coverage Assumption
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="market-share" className="text-base font-medium">
                SHAED Market Coverage: {marketShare}%
              </Label>
              <div className="text-sm text-muted-foreground">
                Revenue Impact: {marketShare}% of total market across all segments
              </div>
            </div>
            <Slider
              id="market-share"
              min={1}
              max={100}
              step={1}
              value={[marketShare]}
              onValueChange={(value) => setMarketShare(value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1%</span>
              <span>Conservative</span>
              <span>Moderate</span>
              <span>Aggressive</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

          {/* SHAED Business Model Summary */}
          <Card className="border-2 border-green-500/30 bg-gradient-to-r from-green-500/10 to-transparent">
            <CardHeader>
              <CardTitle className="text-2xl mb-2">
                {regionMode === 'us' ? 'US' : 'Global'} SHAED Business Model Monetization
              </CardTitle>
              <CardDescription>
                {regionMode === 'us' ? 'US market' : 'Global market'} analysis of SHAED's revenue opportunities through subscription and transactional models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-1">${calculateBottomUpRevenue().toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Annual Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-1">{selectedBottomUpSegments.size}</div>
                  <div className="text-sm text-muted-foreground">Selected Segments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-1">{Object.keys(shaedBusinessModel).length}</div>
                  <div className="text-sm text-muted-foreground">Available Segments</div>
                </div>
              </div>
          <div className="mt-4 text-center">
            <Badge variant="outline" className="text-sm">
              {selectedBottomUpSegments.has('Dealership') ? 
                `Subscription + Transactional` : 
                'Transactional Only'
              }
            </Badge>
          </div>
          
          {/* Dealer KPI Card */}
          {(() => {
            const dealerKPIs = calculateDealerKPIs();
            return dealerKPIs && (
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h5 className="font-semibold text-sm mb-2">Dealership</h5>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Covered Dealers:</span>
                        <span className="font-mono">{dealerKPIs.adjustedDealers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly Cost/Dealer:</span>
                        <span className="font-mono">${dealerKPIs.monthlyCostPerDealer.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Annual Revenue/Dealer:</span>
                        <span className="font-mono">${dealerKPIs.annualRevenuePerDealer.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 mt-2">
                        <span className="font-semibold">Revenue:</span>
                        <span className="font-mono font-bold text-green-600">${dealerKPIs.totalRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
          
          {/* Real-time KPI Breakdown */}
          {Object.keys(calculateSegmentKPIs()).length > 0 && (
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(calculateSegmentKPIs()).map(([segment, kpi]) => (
                  <div key={segment} className="p-4 border rounded-lg bg-muted/30">
                    <h5 className="font-semibold text-sm mb-2">{segment}</h5>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Volume:</span>
                        <span className="font-mono">{kpi.volume.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ASP:</span>
                        <span className="font-mono">${kpi.asp.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Referral Fee:</span>
                        <span className="font-mono">{kpi.referralFee.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 mt-2">
                        <span className="font-semibold">Revenue:</span>
                        <span className="font-mono font-bold text-green-600">${kpi.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
            </CardContent>
          </Card>

          {/* Segment Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue Segments</CardTitle>
              <CardDescription>Select segments to include in SHAED's business model (Dealership selected by default)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(shaedBusinessModel)
                  .sort((a, b) => {
                    const order = [
                      'Dealership',
                      'End User', 
                      'Upfitter',
                      'OEM',
                      'Equipment Manufacturer',
                      'Fleet Management Company',
                      'Logistics',
                      'Traditional Finance Provider',
                      'Insurance Provider',
                      'Maintenance Provider',
                      'Channel Partner',
                      'Remarketing Specialists',
                      'Technology Solutions',
                      'Charging OEM',
                      'Charging as a Service',
                      'EPC',
                      'Depot',
                      'Utility Provider',
                      'Grant Administrator',
                      'EV Finance Provider',
                      'Government Agency',
                      'Dealer Group',
                      'Operating and Maintenance Provider'
                    ];
                    return order.indexOf(a[0]) - order.indexOf(b[0]);
                  })
                  .map(([segment, data]) => (
                  <div key={segment} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                    <Checkbox
                      id={`bottomup-${segment}`}
                      checked={selectedBottomUpSegments.has(segment)}
                      onCheckedChange={() => handleBottomUpSegmentToggle(segment)}
                    />
                    <label
                      htmlFor={`bottomup-${segment}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-medium">{segment}</span>
                        <Badge variant="secondary" className="text-xs">
                          {data.model === 'subscription' ? 'Subscription' : 'Transactional'}
                        </Badge>
                        {data.clickable && <MousePointer className="h-4 w-4 text-blue-500" />}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {data.description}
                      </div>
                    </label>
                    {data.clickable && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSegmentClick(segment)}
                      >
                        Details
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

      {/* Transactional Segment Details Dialog */}
      {showSegmentDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-lg w-full h-full max-w-none max-h-none overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedSegment} Monetization Model</h2>
                  <p className="text-base text-muted-foreground mt-1">
                    Transactional fee model with editable ASP and referral fees
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSegmentDialog(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
            {selectedSegment && shaedBusinessModel[selectedSegment] && (
              <>
                {/* Editable Parameters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Edit3 className="h-5 w-5" />
                      Editable Parameters
                    </CardTitle>
                    <CardDescription>
                      Adjust selling price and referral fee to model different scenarios
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="sellingPrice" className="text-base font-medium">Selling Price (ASP)</Label>
                        <Input
                          id="sellingPrice"
                          type="number"
                          value={shaedBusinessModel[selectedSegment].model === 'transactional' ? getEditableValue(selectedSegment, 'sellingPrice', shaedBusinessModel[selectedSegment].sellingPrice) : 0}
                          onChange={(e) => updateEditableValue(selectedSegment, 'sellingPrice', parseFloat(e.target.value) || 0)}
                          className="text-xl font-mono h-10"
                        />
                        <p className="text-sm text-muted-foreground">
                          Average selling price per transaction
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="referralFee" className="text-base font-medium">Referral Fee (%)</Label>
                        <Input
                          id="referralFee"
                          type="number"
                          step="0.1"
                          value={shaedBusinessModel[selectedSegment].model === 'transactional' ? (getEditableValue(selectedSegment, 'referralFee', shaedBusinessModel[selectedSegment].referralFee) * 100).toFixed(1) : '0.0'}
                          onChange={(e) => updateEditableValue(selectedSegment, 'referralFee', (parseFloat(e.target.value) || 0) / 100)}
                          className="text-xl font-mono h-10"
                        />
                        <p className="text-sm text-muted-foreground">
                          SHAED's commission rate on transactions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Revenue Calculation */}
                <Card className="border-green-500/30 bg-green-500/5">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-700 dark:text-green-300">Revenue Calculation</CardTitle>
                    <CardDescription>
                      Volume × ASP × Referral Fee × Global Market Coverage = SHAED Revenue
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="grid grid-cols-5 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-blue-500 mb-2">
                          {shaedBusinessModel[selectedSegment].model === 'transactional' ? getSegmentVolume(selectedSegment).toLocaleString() : 'N/A'}
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">Volume</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-purple-500 mb-2">
                          ${shaedBusinessModel[selectedSegment].model === 'transactional' ? getEditableValue(selectedSegment, 'sellingPrice', shaedBusinessModel[selectedSegment].sellingPrice).toLocaleString() : '0'}
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">ASP</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-orange-500 mb-2">
                          {shaedBusinessModel[selectedSegment].model === 'transactional' ? (getEditableValue(selectedSegment, 'referralFee', shaedBusinessModel[selectedSegment].referralFee) * 100).toFixed(1) : '0.0'}%
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">Referral Fee</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-indigo-500 mb-2">
                          {marketShare}%
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">Global Coverage</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          ${calculateTransactionalRevenue(selectedSegment).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">SHAED Revenue</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Context */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Market Context</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-muted rounded-lg">
                        <div className="text-3xl font-bold text-primary mb-2">{shaedBusinessModel[selectedSegment].marketSize}</div>
                        <div className="text-base text-muted-foreground font-medium">Market Size</div>
                      </div>
                      <div className="text-center p-6 bg-muted rounded-lg">
                        <div className="text-3xl font-bold text-blue-500 mb-2">{shaedBusinessModel[selectedSegment].marketVolume}</div>
                        <div className="text-base text-muted-foreground font-medium">Market Volume</div>
                      </div>
                      <div className="text-center p-6 bg-muted rounded-lg">
                        <div className="text-3xl font-bold text-green-500 mb-2">{shaedBusinessModel[selectedSegment].employees}</div>
                        <div className="text-base text-muted-foreground font-medium">Employees</div>
                      </div>
                    </div>
                    <div className="mt-6 text-sm text-muted-foreground">
                      {shaedBusinessModel[selectedSegment].description}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Dealer Subscription Model Dialog */}
      {showDealerTechDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-lg w-full h-full max-w-none max-h-none overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Dealership Subscription Model</h2>
                  <p className="text-base text-muted-foreground mt-1">
                    Current dealer tech stack costs and SHAED subscription opportunity
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDealerTechDialog(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            {/* Current Tech Stack Costs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Dealer Tech Stack</CardTitle>
                <CardDescription>
                  Monthly costs for existing technology solutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {shaedBusinessModel['Dealership'].model === 'subscription' && Object.entries(shaedBusinessModel['Dealership'].details).map(([component, data]) => (
                    <div 
                      key={component} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleTechStackToggle(component)}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`tech-${component}`}
                          checked={selectedTechStack.has(component)}
                          onCheckedChange={() => handleTechStackToggle(component)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div>
                          <h4 className="font-semibold text-sm">{component}</h4>
                          <p className="text-xs text-muted-foreground">{data.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-sm font-mono">
                        ${data.cost.toLocaleString()}/mo
                      </Badge>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-4 border-2 border-primary rounded-lg bg-primary/5">
                    <div>
                      <h4 className="font-bold text-lg">Total Monthly Cost</h4>
                      <p className="text-sm text-muted-foreground">
                        Selected tech stack expenditure ({selectedTechStack.size} of {Object.keys(shaedBusinessModel['Dealership'].details).length} items)
                      </p>
                    </div>
                    <Badge variant="default" className="text-lg font-mono">
                      ${calculateSelectedTechStackCost().toLocaleString()}/mo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border-2 border-green-500 rounded-lg bg-green-500/5">
                    <div>
                      <h4 className="font-bold text-lg text-green-700 dark:text-green-300">Total {regionMode === 'us' ? 'US' : 'Global'} Revenue</h4>
                      <p className="text-sm text-muted-foreground">${calculateSelectedTechStackCost().toLocaleString()}/mo × 12 × {Math.round(getDealerCount() * marketShare / 100).toLocaleString()} dealers</p>
                    </div>
                    <Badge variant="outline" className="text-lg font-mono text-green-700 dark:text-green-300 border-green-500">
                      ${getDealerRevenue().toLocaleString()}/yr
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SHAED Subscription Opportunity */}
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader>
                <CardTitle className="text-lg text-green-700 dark:text-green-300">SHAED Subscription Opportunity</CardTitle>
                <CardDescription>
                  Integrated platform replacing fragmented tech stack
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-700 dark:text-green-300">SHAED LTV</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">$641,250</div>
                      <div className="text-xs text-green-600">5-year customer lifetime value</div>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-blue-700 dark:text-blue-300">Network LTV</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">$46.2M</div>
                      <div className="text-xs text-blue-600">Network effect value</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Value Proposition</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Integrated platform vs. 8 separate systems</li>
                        <li>• Reduced complexity and training costs</li>
                        <li>• Better data integration and analytics</li>
                        <li>• Single vendor relationship</li>
                        <li>• Scalable pricing model</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Market Context</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>• {shaedBusinessModel['Dealership'].marketSize} total market size</p>
                        <p>• {shaedBusinessModel['Dealership'].marketVolume} vehicles equipped</p>
                        <p>• {shaedBusinessModel['Dealership'].employees} employees in market</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
