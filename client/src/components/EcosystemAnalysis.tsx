import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Globe, MapPin, Info } from "lucide-react";

interface EcosystemSegment {
  id: number;
  name: string;
  description: string;
  employees: number;
  shaed_ltv: string;
  network_ltv: string;
  global_market_revenue_2024: string;
  global_market_volume_2024: string;
  us_market_revenue_2024: string;
  us_market_volume_2024: string;
  methodology: string;
}

export default function EcosystemAnalysis() {
  const [segments, setSegments] = useState<EcosystemSegment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/ecosystem-analysis.json")
      .then((res) => res.json())
      .then((data) => {
        setSegments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading ecosystem data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading ecosystem analysis...</div>;
  }

  const renderSegmentCard = (segment: EcosystemSegment) => (
    <Card key={segment.id} className="hover:shadow-lg transition-shadow border-border">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-2">{segment.name}</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {segment.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            {segment.employees.toLocaleString()} employees
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* LTV Section */}
        <div className="grid grid-cols-2 gap-4 pb-3 border-b">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5 text-shaed-green" />
              <span className="text-xs font-medium">SHAED LTV (5yr)</span>
            </div>
            <div className="font-bold text-base text-shaed-green pl-5">{segment.shaed_ltv}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-xs font-medium">Network LTV</span>
            </div>
            <div className="font-bold text-base text-blue-500 pl-5">{segment.network_ltv}</div>
          </div>
        </div>

        {/* Global Market */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-xs font-semibold text-muted-foreground">GLOBAL MARKET (2024)</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 pl-5">
            <div>
              <div className="text-xs text-muted-foreground">Revenue</div>
              <div className="font-semibold text-sm">{segment.global_market_revenue_2024}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Volume</div>
              <div className="font-semibold text-sm">{segment.global_market_volume_2024}</div>
            </div>
          </div>
        </div>

        {/* US Market */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-xs font-semibold text-muted-foreground">US MARKET (2024)</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 pl-5">
            <div>
              <div className="text-xs text-muted-foreground">Revenue</div>
              <div className="font-semibold text-sm">{segment.us_market_revenue_2024}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Volume</div>
              <div className="font-semibold text-sm">{segment.us_market_volume_2024}</div>
            </div>
          </div>
        </div>

        {/* Methodology */}
        <div className="pt-3 border-t">
          <div className="flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">Methodology</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{segment.methodology}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="overview">Segment Overview</TabsTrigger>
          <TabsTrigger value="relationships" disabled>Network Relationships</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Segment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {segments.map(segment => renderSegmentCard(segment))}
          </div>
        </TabsContent>

        <TabsContent value="relationships">
          <Card>
            <CardHeader>
              <CardTitle>Network Relationships</CardTitle>
              <CardDescription>Coming soon - Visualization of ecosystem connections and network effects</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

