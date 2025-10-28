import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, TrendingUp, Globe, MapPin, ExternalLink, Calculator, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import MarketSize from "./MarketSize";

interface DataPoint {
  value: number | null;
  display: string;
  source: string | null;
  sourceType: "direct" | "estimated";
  methodology: string | null;
  note: string;
}

interface EcosystemSegment {
  id: string;
  name: string;
  description: string;
  shaedLtv: number;
  networkLtv: number;
  globalRevenue2024: DataPoint;
  globalVolume2024: DataPoint;
  globalEmployees2024: DataPoint;
  usRevenue2024: DataPoint;
  usVolume2024: DataPoint;
  usEmployees2024: DataPoint;
}

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataPoint: DataPoint | null;
  segmentName: string;
  fieldName: string;
}

function MethodologyModal({ isOpen, onClose, dataPoint, segmentName, fieldName }: MethodologyModalProps) {
  if (!dataPoint) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {segmentName} - {fieldName}
          </DialogTitle>
          <DialogDescription className="text-base">
            {dataPoint.display}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Source Type Badge */}
          <div className="flex items-center gap-2">
            <Badge variant={dataPoint.sourceType === "direct" ? "default" : "secondary"} className="text-sm">
              {dataPoint.sourceType === "direct" ? "Direct Source" : "Estimated"}
            </Badge>
          </div>

          {/* Direct Source */}
          {dataPoint.source && dataPoint.sourceType === "direct" && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Source
              </h4>
              <a 
                href={dataPoint.source} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline break-all block"
              >
                {dataPoint.source}
              </a>
              {dataPoint.note && (
                <p className="text-sm text-muted-foreground mt-2">
                  {dataPoint.note}
                </p>
              )}
            </div>
          )}

          {/* Estimation Methodology */}
          {dataPoint.sourceType === "estimated" && dataPoint.methodology && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Estimation Methodology
              </h4>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {dataPoint.methodology}
                </p>
              </div>
              {dataPoint.note && (
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Note:</strong> {dataPoint.note}
                </p>
              )}
              {dataPoint.source && (
                <div className="mt-3">
                  <h5 className="font-medium text-xs text-muted-foreground mb-1">Base Data Source:</h5>
                  <a 
                    href={dataPoint.source} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline break-all block"
                  >
                    {dataPoint.source}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Investor Note */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-900 dark:text-blue-100">
              {dataPoint.sourceType === "direct" 
                ? "This data point is sourced directly from authoritative industry sources and can be independently verified via the provided link." 
                : "This estimate is based on transparent methodology using industry benchmarks and available market data. All assumptions and calculation methods are documented above for your review and validation."}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose} variant="outline">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ClickableDataPointProps {
  value: string;
  dataPoint: DataPoint;
  segmentName: string;
  fieldName: string;
  icon?: React.ReactNode;
}

function ClickableDataPoint({ value, dataPoint, segmentName, fieldName, icon }: ClickableDataPointProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group flex items-center gap-1.5 hover:bg-muted/50 p-1.5 -m-1.5 rounded transition-colors text-left w-full"
      >
        <div className="flex-1">
          <div className="font-semibold text-sm group-hover:text-primary transition-colors">
            {value}
          </div>
        </div>
        {icon || (
          dataPoint.sourceType === "direct" ? (
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          ) : (
            <Calculator className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          )
        )}
      </button>
      <MethodologyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dataPoint={dataPoint}
        segmentName={segmentName}
        fieldName={fieldName}
      />
    </>
  );
}

export default function EcosystemAnalysisEnhanced() {
  const [segments, setSegments] = useState<EcosystemSegment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/ecosystem-analysis-enhanced.json")
      .then((res) => res.json())
      .then((data) => {
        setSegments(data.segments);
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
            <div className="font-bold text-base text-shaed-green pl-5">
              ${segment.shaedLtv.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-xs font-medium">Network LTV</span>
            </div>
            <div className="font-bold text-base text-blue-500 pl-5">
              ${segment.networkLtv.toLocaleString()}
            </div>
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
              <div className="text-xs text-muted-foreground mb-1">Market Size</div>
              <ClickableDataPoint
                value={segment.globalRevenue2024.display}
                dataPoint={segment.globalRevenue2024}
                segmentName={segment.name}
                fieldName="Global Market Size 2024"
              />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Volume</div>
              <ClickableDataPoint
                value={segment.globalVolume2024.display}
                dataPoint={segment.globalVolume2024}
                segmentName={segment.name}
                fieldName="Global Volume 2024"
              />
            </div>
          </div>
          <div className="mt-3 pl-5">
            <div className="text-xs text-muted-foreground mb-1">Employees</div>
            <ClickableDataPoint
              value={segment.globalEmployees2024.display}
              dataPoint={segment.globalEmployees2024}
              segmentName={segment.name}
              fieldName="Global Employees 2024"
              icon={<Users className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />}
            />
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
              <div className="text-xs text-muted-foreground mb-1">Market Size</div>
              <ClickableDataPoint
                value={segment.usRevenue2024.display}
                dataPoint={segment.usRevenue2024}
                segmentName={segment.name}
                fieldName="US Market Size 2024"
              />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Volume</div>
              <ClickableDataPoint
                value={segment.usVolume2024.display}
                dataPoint={segment.usVolume2024}
                segmentName={segment.name}
                fieldName="US Volume 2024"
              />
            </div>
          </div>
          <div className="mt-3 pl-5">
            <div className="text-xs text-muted-foreground mb-1">Employees</div>
            <ClickableDataPoint
              value={segment.usEmployees2024.display}
              dataPoint={segment.usEmployees2024}
              segmentName={segment.name}
              fieldName="US Employees 2024"
              icon={<Users className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />}
            />
          </div>
        </div>

        {/* Source Indicator */}
        <div className="pt-3 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              Click any number for source details
            </Badge>
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
          <TabsTrigger value="market-size">Market Size</TabsTrigger>
          <TabsTrigger value="relationships" disabled>Network Relationships</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Info Banner */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="py-3">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                All data points are clickable. Click any number to view source documentation or estimation methodology. 
                Direct sources link to authoritative industry data. Estimated values show transparent calculation methods and assumptions.
              </p>
            </CardContent>
          </Card>

          {/* Segment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {segments
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
                  'Dealer Group'
                ];
                return order.indexOf(a.name) - order.indexOf(b.name);
              })
              .map(segment => renderSegmentCard(segment))}
          </div>
        </TabsContent>

        <TabsContent value="market-size" className="space-y-6">
          <MarketSize />
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

