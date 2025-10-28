import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Factory,
  Zap,
  Truck,
  Plug,
  Building2,
  TrendingUp,
  Network,
  Package
} from "lucide-react";

interface StakeholderAnalysisProps {
  data: any;
}

export default function StakeholderAnalysis({ data }: StakeholderAnalysisProps) {
  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading stakeholder data...</p>
      </div>
    );
  }

  const categories = data.stakeholder_categories;

  return (
    <div className="space-y-6">
      {/* Market Coverage Hero */}
      <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-3xl mb-2">{data.market_coverage.hero_metric}</CardTitle>
              <CardDescription className="text-base">
                {data.market_coverage.total_stakeholders} stakeholders • {data.market_coverage.annual_vehicle_volume} annual vehicles • {data.market_coverage.market_value} market value
              </CardDescription>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-2xl font-bold text-green-500 mb-1">98.9%</div>
              <div className="text-xs text-muted-foreground">Network Effect</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stakeholder Categories Tabs */}
      <Tabs defaultValue="oems_traditional" className="space-y-4">
        <TabsList className="bg-muted flex-wrap h-auto">
          <TabsTrigger value="oems_traditional">Traditional OEMs</TabsTrigger>
          <TabsTrigger value="oems_electric">Electric Specialists</TabsTrigger>
          <TabsTrigger value="upfitters">Upfitters</TabsTrigger>
          <TabsTrigger value="charging">Charging Infrastructure</TabsTrigger>
          <TabsTrigger value="fleet">Fleet Customers</TabsTrigger>
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
        </TabsList>

        {/* Traditional OEMs Tab */}
        <TabsContent value="oems_traditional" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5 text-primary" />
                {categories.oems_traditional.category} ({categories.oems_traditional.total})
              </CardTitle>
              <CardDescription>
                {categories.oems_traditional.market_share} market share • {categories.oems_traditional.annual_volume} • {categories.oems_traditional.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.oems_traditional.partners.map((partner: any, idx: number) => (
                <Card key={idx} className="border-border bg-muted/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{partner.name}</CardTitle>
                        <CardDescription className="text-sm">{partner.products}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 whitespace-nowrap">
                        {partner.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Market Share</div>
                        <div className="text-lg font-semibold text-foreground">{partner.market_share}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Annual Units</div>
                        <div className="text-lg font-semibold text-foreground">{partner.annual_units}</div>
                      </div>
                    </div>
                    
                    {partner.key_metrics && (
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <div className="text-xs font-semibold text-muted-foreground mb-2">Key Metrics</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {Object.entries(partner.key_metrics).map(([key, value]: [string, any]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="font-medium text-foreground">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {partner.achievements && (
                      <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                        <div className="text-xs font-semibold text-blue-500 mb-1">Achievements</div>
                        <div className="text-xs text-foreground">{partner.achievements}</div>
                      </div>
                    )}
                    
                    {partner.challenges && (
                      <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                        <div className="text-xs font-semibold text-yellow-500 mb-1">Challenges</div>
                        <div className="text-xs text-foreground">{partner.challenges}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Electric OEMs Tab */}
        <TabsContent value="oems_electric" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                {categories.oems_electric.category} ({categories.oems_electric.total})
              </CardTitle>
              <CardDescription>
                {categories.oems_electric.market_value} • {categories.oems_electric.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.oems_electric.partners.map((partner: any, idx: number) => (
                <Card key={idx} className="border-border bg-muted/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{partner.name}</CardTitle>
                        <CardDescription className="text-sm">{partner.products}</CardDescription>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          partner.status.includes("Production") || partner.status.includes("Growing")
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : partner.status.includes("Pre-revenue")
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        }
                      >
                        {partner.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Annual Units</div>
                        <div className="text-sm font-semibold text-foreground">{partner.annual_units}</div>
                      </div>
                      {partner.segment && (
                        <div className="p-3 rounded-lg bg-background/50 border border-border">
                          <div className="text-xs text-muted-foreground mb-1">Segment</div>
                          <div className="text-sm font-semibold text-foreground">{partner.segment}</div>
                        </div>
                      )}
                    </div>
                    
                    {partner.key_metrics && (
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <div className="text-xs font-semibold text-muted-foreground mb-2">Key Metrics</div>
                        <div className="space-y-1.5 text-xs">
                          {Object.entries(partner.key_metrics).map(([key, value]: [string, any]) => (
                            <div key={key} className="flex justify-between gap-2">
                              <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="font-medium text-foreground text-right">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {partner.achievements && (
                      <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                        <div className="text-xs font-semibold text-blue-500 mb-1">Achievements</div>
                        <div className="text-xs text-foreground">{partner.achievements}</div>
                      </div>
                    )}
                    
                    {partner.viability && (
                      <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                        <div className="text-xs font-semibold text-red-500 mb-1">Viability Concerns</div>
                        <div className="text-xs text-foreground">{partner.viability}</div>
                      </div>
                    )}
                    
                    {partner.concerns && (
                      <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                        <div className="text-xs font-semibold text-orange-500 mb-1">Concerns</div>
                        <div className="text-xs text-foreground">{partner.concerns}</div>
                      </div>
                    )}
                    
                    {partner.claims && (
                      <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                        <div className="text-xs font-semibold text-purple-500 mb-1">Claims</div>
                        <div className="text-xs text-foreground">{partner.claims}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upfitters Tab */}
        <TabsContent value="upfitters" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                {categories.upfitters.category} ({categories.upfitters.total})
              </CardTitle>
              <CardDescription>
                {categories.upfitters.market_value} market • {categories.upfitters.industry_size} • {categories.upfitters.annual_units} annual units • {categories.upfitters.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.upfitters.partners.map((partner: any, idx: number) => (
                <Card key={idx} className="border-border bg-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg mb-1">{partner.name}</CardTitle>
                    <CardDescription className="text-sm">{partner.products}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {partner.market_share && (
                        <div className="p-3 rounded-lg bg-background/50 border border-border">
                          <div className="text-xs text-muted-foreground mb-1">Market Share</div>
                          <div className="text-sm font-semibold text-foreground">{partner.market_share}</div>
                        </div>
                      )}
                      {partner.annual_units && (
                        <div className="p-3 rounded-lg bg-background/50 border border-border">
                          <div className="text-xs text-muted-foreground mb-1">Annual Units</div>
                          <div className="text-sm font-semibold text-foreground">{partner.annual_units}</div>
                        </div>
                      )}
                      {partner.position && (
                        <div className="p-3 rounded-lg bg-background/50 border border-border">
                          <div className="text-xs text-muted-foreground mb-1">Position</div>
                          <div className="text-sm font-semibold text-foreground">{partner.position}</div>
                        </div>
                      )}
                    </div>
                    
                    {partner.key_metrics && (
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <div className="text-xs font-semibold text-muted-foreground mb-2">Key Metrics</div>
                        <div className="space-y-1.5 text-xs">
                          {Object.entries(partner.key_metrics).map(([key, value]: [string, any]) => (
                            <div key={key} className="flex justify-between gap-2">
                              <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="font-medium text-foreground text-right">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {partner.claim && (
                      <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                        <div className="text-xs text-foreground">{partner.claim}</div>
                      </div>
                    )}
                    
                    {partner.customers && (
                      <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                        <div className="text-xs font-semibold text-green-500 mb-1">Customers</div>
                        <div className="text-xs text-foreground">{partner.customers}</div>
                      </div>
                    )}
                    
                    {partner.note && (
                      <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                        <div className="text-xs text-foreground italic">{partner.note}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charging Infrastructure Tab */}
        <TabsContent value="charging" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5 text-primary" />
                {categories.charging_partners.category} ({categories.charging_partners.total})
              </CardTitle>
              <CardDescription>
                {categories.charging_partners.market_share} • {categories.charging_partners.market_value} • {categories.charging_partners.commercial_share} commercial share • {categories.charging_partners.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.charging_partners.partners.map((partner: any, idx: number) => (
                <Card key={idx} className="border-border bg-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg mb-1">{partner.name}</CardTitle>
                    <CardDescription className="text-sm">{partner.products}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {partner.market_share && (
                        <div className="p-3 rounded-lg bg-background/50 border border-border">
                          <div className="text-xs text-muted-foreground mb-1">Market Share</div>
                          <div className="text-sm font-semibold text-foreground">{partner.market_share}</div>
                        </div>
                      )}
                      {partner.infrastructure && (
                        <div className="p-3 rounded-lg bg-background/50 border border-border">
                          <div className="text-xs text-muted-foreground mb-1">Infrastructure</div>
                          <div className="text-sm font-semibold text-foreground">{partner.infrastructure}</div>
                        </div>
                      )}
                    </div>
                    
                    {partner.key_metrics && (
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <div className="text-xs font-semibold text-muted-foreground mb-2">Key Metrics</div>
                        <div className="space-y-1.5 text-xs">
                          {Object.entries(partner.key_metrics).map(([key, value]: [string, any]) => (
                            <div key={key} className="flex justify-between gap-2">
                              <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="font-medium text-foreground text-right">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {partner.partnerships && (
                      <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                        <div className="text-xs font-semibold text-blue-500 mb-1">Partnerships</div>
                        <div className="text-xs text-foreground">{partner.partnerships}</div>
                      </div>
                    )}
                    
                    {partner.focus && (
                      <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                        <div className="text-xs font-semibold text-green-500 mb-1">Focus</div>
                        <div className="text-xs text-foreground">{partner.focus}</div>
                      </div>
                    )}
                    
                    {partner.differentiation && (
                      <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                        <div className="text-xs font-semibold text-purple-500 mb-1">Differentiation</div>
                        <div className="text-xs text-foreground">{partner.differentiation}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fleet Customers Tab */}
        <TabsContent value="fleet" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {categories.fleet_customers.category} ({categories.fleet_customers.total})
              </CardTitle>
              <CardDescription>
                {categories.fleet_customers.total_fleet_size} total fleet • {categories.fleet_customers.annual_purchases} annual purchases • {categories.fleet_customers.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.fleet_customers.partners.map((partner: any, idx: number) => (
                <Card key={idx} className="border-border bg-muted/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{partner.name}</CardTitle>
                        <CardDescription className="text-sm">{partner.business}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Fleet Size</div>
                        <div className="text-lg font-semibold text-foreground">{partner.fleet_size}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Annual Purchases</div>
                        <div className="text-lg font-semibold text-foreground">{partner.annual_purchases}</div>
                      </div>
                    </div>
                    
                    {partner.fleet_breakdown && (
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <div className="text-xs font-semibold text-muted-foreground mb-2">Fleet Breakdown</div>
                        <div className="space-y-1.5 text-xs">
                          {Object.entries(partner.fleet_breakdown).map(([key, value]: [string, any]) => (
                            <div key={key} className="flex justify-between gap-2">
                              <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="font-medium text-foreground text-right">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {partner.key_metrics && (
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <div className="text-xs font-semibold text-muted-foreground mb-2">Key Metrics</div>
                        <div className="space-y-1.5 text-xs">
                          {Object.entries(partner.key_metrics).map(([key, value]: [string, any]) => (
                            <div key={key} className="flex justify-between gap-2">
                              <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="font-medium text-foreground text-right">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {partner.ev_commitment && (
                      <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                        <div className="text-xs font-semibold text-green-500 mb-1">EV Commitment</div>
                        <div className="text-xs text-foreground">{partner.ev_commitment}</div>
                      </div>
                    )}
                    
                    {partner.ev_initiative && (
                      <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                        <div className="text-xs font-semibold text-green-500 mb-1">EV Initiative</div>
                        <div className="text-xs text-foreground">{partner.ev_initiative}</div>
                      </div>
                    )}
                    
                    {partner.note && (
                      <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                        <div className="text-xs text-foreground italic">{partner.note}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Market Segments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Traditional Vehicles</CardTitle>
                <CardDescription>{data.market_segments.traditional_vehicles.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-3xl font-bold text-blue-500 mb-1">
                    {data.market_segments.traditional_vehicles.current_market_share}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Market Share</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Annual Volume:</span>
                    <span className="font-semibold text-foreground">{data.market_segments.traditional_vehicles.annual_volume}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-semibold text-foreground">{data.market_segments.traditional_vehicles.status}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Key Players:</span>
                    <span className="font-semibold text-foreground text-right">{data.market_segments.traditional_vehicles.key_players}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Electric Vehicles</CardTitle>
                <CardDescription>Emerging segment with rapid growth trajectory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                    <div className="text-xl font-bold text-green-500 mb-1">
                      {data.market_segments.electric_vehicles.current_market_share}
                    </div>
                    <div className="text-xs text-muted-foreground">Current</div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                    <div className="text-xl font-bold text-green-500 mb-1">
                      {data.market_segments.electric_vehicles.projected_2025}
                    </div>
                    <div className="text-xs text-muted-foreground">2025</div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                    <div className="text-xl font-bold text-green-500 mb-1">
                      {data.market_segments.electric_vehicles.projected_2030.split('|')[0].trim()}
                    </div>
                    <div className="text-xs text-muted-foreground">2030</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">US Market:</span>
                    <span className="font-semibold text-foreground">{data.market_segments.electric_vehicles.us_market_value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Global Market:</span>
                    <span className="font-semibold text-foreground">{data.market_segments.electric_vehicles.global_market_value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Asia Pacific Share:</span>
                    <span className="font-semibold text-foreground">{data.market_segments.electric_vehicles.asia_pacific_share}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-semibold text-foreground">{data.market_segments.electric_vehicles.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Value Chain Coverage */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-primary" />
                Value Chain Coverage
              </CardTitle>
              <CardDescription>SHAED's position across the commercial vehicle ecosystem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(data.value_chain_coverage).map(([stage, info]: [string, any]) => (
                  <div key={stage} className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-2xl font-bold text-primary mb-1">{info.partners}</div>
                    <div className="text-xs text-muted-foreground capitalize mb-2">{stage.replace(/_/g, ' ')}</div>
                    <Badge 
                      variant={info.coverage === "High" ? "default" : "outline"} 
                      className="text-xs mb-2"
                    >
                      {info.coverage}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-2">{info.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

