import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, Users, DollarSign, Package, Calendar, Award } from "lucide-react";

interface StakeholderData {
  type: string;
  products: string;
  annual_revenue?: string;
  annual_volume?: string;
  market_share?: string;
  employees?: string;
  founded?: string;
  key_metrics?: string;
  viability?: string;
  locations?: string;
  facilities?: string;
  brands_sold?: string;
  fleet_size?: string;
  charging_ports?: string;
  portfolio_size?: string;
}

interface StakeholdersMap {
  [key: string]: StakeholderData;
}

export default function StakeholderAnalysisComprehensive() {
  const [stakeholders, setStakeholders] = useState<StakeholdersMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/stakeholders-comprehensive.json")
      .then((res) => res.json())
      .then((data) => {
        setStakeholders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading stakeholder data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading comprehensive stakeholder data...</div>;
  }

  // Categorize stakeholders
  const oems = Object.entries(stakeholders).filter(([_, data]) => 
    data.type.startsWith("OEM")
  );
  
  const dealers = Object.entries(stakeholders).filter(([_, data]) => 
    data.type.startsWith("Dealer")
  );
  
  const upfitters = Object.entries(stakeholders).filter(([_, data]) => 
    data.type.startsWith("Upfitter")
  );
  
  const charging = Object.entries(stakeholders).filter(([_, data]) => 
    data.type === "Charging Infrastructure"
  );
  
  const endUsers = Object.entries(stakeholders).filter(([_, data]) => 
    data.type.startsWith("End-User")
  );
  
  const finance = Object.entries(stakeholders).filter(([_, data]) => 
    data.type === "Finance Partner"
  );

  const renderStakeholderCard = (name: string, data: StakeholderData) => (
    <Card key={name} className="hover:shadow-lg transition-shadow border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-semibold mb-2">{name}</CardTitle>
            <Badge variant="outline" className="text-xs font-normal">
              {data.type}
            </Badge>
          </div>
          {data.viability && (
            <Badge 
              variant={
                data.viability.includes("Strong") ? "default" : 
                data.viability.includes("Moderate") ? "secondary" : 
                "outline"
              }
              className="shrink-0"
            >
              {data.viability}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Products */}
        <div className="flex items-start gap-2 pb-3 border-b">
          <Package className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground leading-relaxed">{data.products}</span>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {data.annual_revenue && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <DollarSign className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Revenue</span>
              </div>
              <div className="font-semibold text-sm pl-5">{data.annual_revenue}</div>
            </div>
          )}
          
          {data.annual_volume && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Volume</span>
              </div>
              <div className="font-semibold text-sm pl-5">{data.annual_volume}</div>
            </div>
          )}
          
          {data.fleet_size && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Package className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Fleet Size</span>
              </div>
              <div className="font-semibold text-sm pl-5">{data.fleet_size}</div>
            </div>
          )}
          
          {data.charging_ports && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Charging Ports</span>
              </div>
              <div className="font-semibold text-sm pl-5">{data.charging_ports}</div>
            </div>
          )}
          
          {data.portfolio_size && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <DollarSign className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Portfolio</span>
              </div>
              <div className="font-semibold text-sm pl-5">{data.portfolio_size}</div>
            </div>
          )}
          
          {data.market_share && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Award className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Market Share</span>
              </div>
              <div className="font-semibold text-sm pl-5">{data.market_share}</div>
            </div>
          )}
          
          {data.employees && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Employees</span>
              </div>
              <div className="font-semibold text-sm pl-5">{data.employees}</div>
            </div>
          )}
          
          {(data.locations || data.facilities) && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Locations</span>
              </div>
              <div className="font-semibold text-sm pl-5">{data.locations || data.facilities}</div>
            </div>
          )}
          
          {data.founded && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Founded</span>
              </div>
              <div className="font-semibold text-sm pl-5">{data.founded}</div>
            </div>
          )}
        </div>

        {data.brands_sold && (
          <div className="pt-3 border-t space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Brands Sold</span>
            </div>
            <div className="font-semibold text-sm pl-5">{data.brands_sold}</div>
          </div>
        )}

        {data.key_metrics && (
          <div className="pt-3 border-t">
            <div className="text-xs font-medium text-muted-foreground mb-1.5">Key Metrics</div>
            <div className="text-sm leading-relaxed">{data.key_metrics}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Detailed Stakeholder Tabs */}
      <Tabs defaultValue="oems" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="oems">OEMs ({oems.length})</TabsTrigger>
          <TabsTrigger value="dealers">Dealers ({dealers.length})</TabsTrigger>
          <TabsTrigger value="upfitters">Upfitters ({upfitters.length})</TabsTrigger>
          <TabsTrigger value="charging">Charging ({charging.length})</TabsTrigger>
          <TabsTrigger value="endusers">End-Users ({endUsers.length})</TabsTrigger>
          <TabsTrigger value="finance">Finance ({finance.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="oems" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {oems.map(([name, data]) => renderStakeholderCard(name, data))}
          </div>
        </TabsContent>

        <TabsContent value="dealers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dealers.map(([name, data]) => renderStakeholderCard(name, data))}
          </div>
        </TabsContent>

        <TabsContent value="upfitters" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upfitters.map(([name, data]) => renderStakeholderCard(name, data))}
          </div>
        </TabsContent>

        <TabsContent value="charging" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {charging.map(([name, data]) => renderStakeholderCard(name, data))}
          </div>
        </TabsContent>

        <TabsContent value="endusers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {endUsers.map(([name, data]) => renderStakeholderCard(name, data))}
          </div>
        </TabsContent>

        <TabsContent value="finance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {finance.map(([name, data]) => renderStakeholderCard(name, data))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

