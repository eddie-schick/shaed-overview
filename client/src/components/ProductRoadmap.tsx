import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, TrendingUp, Users, Package, Target, Building2, DollarSign, Network, Lightbulb, Calendar, MapPin } from "lucide-react";

interface RoadmapData {
  released_features: ReleasedFeature[];
  roadmap_phases: RoadmapPhase[];
  lifecycle_stages: LifecycleStage[];
}

interface ReleasedFeature {
  id: string;
  name: string;
  pillar: string;
  status: string;
  lifecycle_stages: string[];
  stakeholders: string[];
  description: string;
  key_capabilities: string[];
}

interface RoadmapPhase {
  phase: number;
  name: string;
  timeline: string;
  target_mrr: string;
  focus: string;
  products: PhaseProduct[];
}

interface PhaseProduct {
  name: string;
  lifecycle_stages: string[];
  stakeholders: string[];
  description: string;
  key_features: string[];
}

interface LifecycleStage {
  stage: string;
  name: string;
  description: string;
  stakeholders: StakeholderIntegration[];
}

interface StakeholderIntegration {
  name: string;
  role: string;
  onboarding_plan: string;
  products: string[];
  integration_status: string;
}

interface StakeholderRoadmap {
  id: number;
  name: string;
  displayName: string;
  revenueModel: string;
  products: {
    released: Array<{ name: string; revenue: string }>;
    roadmap: Array<{ name: string; phase: string; revenue: string }>;
  };
  lifecycleStages: string[];
}

export default function ProductRoadmap({ data }: { data: RoadmapData }) {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [selectedStakeholder, setSelectedStakeholder] = useState<string | null>(null);
  const [stakeholderRoadmap, setStakeholderRoadmap] = useState<StakeholderRoadmap[]>([]);

  useEffect(() => {
    // Load stakeholder roadmap data
    fetch("/stakeholder-roadmap.json")
      .then((res) => res.json())
      .then((data) => setStakeholderRoadmap(data))
      .catch((err) => console.error("Error loading stakeholder roadmap:", err));
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "Released") return "bg-green-500";
    if (status.startsWith("Phase")) return "bg-blue-500";
    return "bg-gray-500";
  };

  const getIntegrationStatusColor = (status: string) => {
    if (status === "Released") return "text-green-600 bg-green-50";
    if (status.startsWith("Phase")) return "text-blue-600 bg-blue-50";
    if (status === "Partial") return "text-yellow-600 bg-yellow-50";
    return "text-gray-600 bg-gray-50";
  };

  const getPhaseColor = (phase: string) => {
    if (phase === "Phase 1") return "bg-purple-100 text-purple-700 border-purple-300";
    if (phase === "Phase 2") return "bg-blue-100 text-blue-700 border-blue-300";
    if (phase === "Phase 3") return "bg-cyan-100 text-cyan-700 border-cyan-300";
    if (phase === "Phase 4") return "bg-orange-100 text-orange-700 border-orange-300";
    if (phase === "Phase 5") return "bg-pink-100 text-pink-700 border-pink-300";
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <Lightbulb className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <Package className="w-4 h-4 mr-2" />
            Product Roadmap
          </TabsTrigger>
          <TabsTrigger value="lifecycle" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Lifecycle Stage View
          </TabsTrigger>
          <TabsTrigger value="stakeholders" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <Building2 className="w-4 h-4 mr-2" />
            Stakeholder View
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-green-600" />
                <CardTitle>Strategic Rationale: The Cox Automotive Framework</CardTitle>
              </div>
              <CardDescription>
                SHAED's opportunity to dominate commercial vehicles by replicating Cox Automotive's success model in an underserved $50B+ market
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cox Automotive Success Model */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Cox Automotive Success Model</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Cox Automotive operates the most comprehensive vehicle lifecycle platform in the consumer automotive industry, generating billions in revenue across wholesale auctions (Manheim), retail marketplaces (Autotrader, KBB), dealer software (Dealertrack, vAuto, VinSolutions), and financial services (NextGear Capital). Through strategic acquisitions totaling $6-7 billion between 2010-2021, Cox built an unparalleled vertical integration spanning the entire consumer vehicle lifecycle with powerful network effects where each product strengthens the others.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-green-200 bg-green-50/30">
                    <CardHeader>
                      <CardTitle className="text-sm">Wholesale/Inventory Layer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <p><strong>Manheim:</strong> 70+ physical auction locations handling tens of millions of vehicles annually</p>
                      <p><strong>Revenue:</strong> Buyer fees ($200-600), seller fees ($75-300), transaction % (1-3%)</p>
                      <p><strong>NextGear Capital:</strong> Inventory financing at Prime + 1-4%</p>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50/30">
                    <CardHeader>
                      <CardTitle className="text-sm">Retail/Consumer Layer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <p><strong>Autotrader:</strong> $500-5K/month dealer subscriptions + lead generation fees</p>
                      <p><strong>KBB:</strong> 90-year brand equity, dealer advertising ($15-50/lead), data licensing</p>
                      <p><strong>Data Moat:</strong> Proprietary pricing data competitors cannot replicate</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-purple-50/30">
                    <CardHeader>
                      <CardTitle className="text-sm">Dealer Operations Layer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <p><strong>Dealertrack:</strong> $4B acquisition, F&I transaction fees ($15-35), DMS subscriptions ($800-2.5K/month)</p>
                      <p><strong>VinSolutions CRM:</strong> $500-2.5K/month</p>
                      <p><strong>vAuto:</strong> Inventory management $500-5K/month</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Cox's Commercial Vehicle Gap */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h3 className="text-base font-semibold text-red-900 mb-3">Cox's Commercial Vehicle Gap</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Despite dominating consumer vehicles, Cox has <strong>zero presence</strong> in commercial vehicles—a $50B+ annual market with fundamentally different needs:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-900 mb-2">Missing Capabilities (Cox Cannot Serve):</p>
                    <ul className="space-y-1 text-xs text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span><strong>Procurement:</strong> No RFP processes, bulk purchasing, spec management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span><strong>Upfitting:</strong> Zero presence in 20-50% of total vehicle cost</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span><strong>Compliance:</strong> No DOT, IFTA, IRP, weight permit solutions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span><strong>Fleet Management:</strong> No telematics (Geotab 3M+ vehicles, Samsara $850M revenue)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span><strong>Lifecycle Optimization:</strong> No TCO analysis, depreciation modeling</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-900 mb-2">SHAED's Coverage:</p>
                    <ul className="space-y-1 text-xs text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>SHAED Marketplace:</strong> Commercial EV procurement and remarketing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>Upfit Portal:</strong> 20-50% cost component</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>Digital Deal Jackets:</strong> Commercial transaction documentation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>Pritchard Dashboard:</strong> Fleet-level visibility</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>PaperX AI:</strong> Document processing automation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Commercial EV Inflection Point */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="text-base font-semibold text-blue-900 mb-3">Commercial EV Inflection Point</h3>
                <p className="text-sm text-gray-700 mb-3">
                  The commercial vehicle market is undergoing a <strong>trillion-dollar transformation</strong> to electric powertrains, creating a once-in-a-generation opportunity:
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span><strong>IRA Tax Credits:</strong> $40K per commercial EV vehicle (vs. $7.5K consumer)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span><strong>2030 Projection:</strong> 40% of new commercial vehicle sales (Goldman Sachs)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span><strong>Operating Cost Advantage:</strong> 30-40% lower than diesel for last-mile delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span><strong>First-Mover Advantage:</strong> Commercial EV market still nascent, Cox absent</span>
                  </li>
                </ul>
              </div>

              {/* SHAED's Competitive Moat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-green-200 bg-green-50/30">
                  <CardHeader>
                    <CardTitle className="text-base">Network Effect Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span><strong>Multi-Sided Network:</strong> More dealers attract more fleet buyers; more fleet buyers attract more dealers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span><strong>Data Flywheel:</strong> Transaction data → valuation models → marketplace efficiency → more transactions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span><strong>Switching Costs:</strong> Integrated workflow across procurement-upfitting-operations-remarketing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span><strong>API Ecosystem:</strong> 3rd-party integrations create stickiness (Geotab model with 400+ integrations)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50/30">
                  <CardHeader>
                    <CardTitle className="text-base">Total Addressable Market</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span><strong>3,798 Truck Dealerships:</strong> $235.5B annual revenue (ATD data)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span><strong>16,957 Car Dealerships:</strong> $1.24T revenue (many sell commercial vehicles)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span><strong>Dealer Technology:</strong> $3.4B-$4.6B annual spend across 20,755 dealerships</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span><strong>Network LTV:</strong> $832.5M across 23 ecosystem segments</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-base">Why SHAED Wins vs. Cox Automotive</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Strategic Advantages</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 mt-0.5">→</span>
                          <span><strong>Commercial Vehicle Focus:</strong> Purpose-built for fleet lifecycle vs. consumer vehicle tools</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 mt-0.5">→</span>
                          <span><strong>EV Transition Timing:</strong> Positioned for electrification inflection point</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 mt-0.5">→</span>
                          <span><strong>First-Mover Advantage:</strong> Commercial EV market still nascent, Cox absent</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Platform Differentiation</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 mt-0.5">→</span>
                          <span><strong>Integrated Platform:</strong> End-to-end lifecycle vs. fragmented point solutions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 mt-0.5">→</span>
                          <span><strong>Network Effects:</strong> Multi-stakeholder platform vs. dealer-centric tools</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 mt-0.5">→</span>
                          <span><strong>Data Advantage:</strong> Commercial-specific valuation, TCO, operational data</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRODUCT ROADMAP TAB */}
        <TabsContent value="roadmap" className="space-y-6">
          {/* Released Features Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <CardTitle>Released Features</CardTitle>
              </div>
              <CardDescription>
                Currently available products serving 7 core capabilities across the commercial vehicle lifecycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.released_features.map((feature) => (
                  <Card key={feature.id} className="border-green-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                          <span>{feature.name}</span>
                        </CardTitle>
                        <Badge className="bg-green-600 shrink-0">Released</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-700">{feature.description}</p>
                      
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Lifecycle Stages:</p>
                        <div className="flex flex-wrap gap-1">
                          {feature.lifecycle_stages.map((stage) => (
                            <Badge key={stage} variant="outline" className="text-xs">
                              {stage}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Key Stakeholders:</p>
                        <div className="flex flex-wrap gap-1">
                          {feature.stakeholders.map((stakeholder) => (
                            <Badge key={stakeholder} variant="outline" className="text-xs bg-blue-50">
                              {stakeholder}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Capabilities:</p>
                        <ul className="space-y-0.5">
                          {feature.key_capabilities.slice(0, 3).map((capability, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                              <span className="text-green-600 mt-0.5">•</span>
                              <span>{capability}</span>
                            </li>
                          ))}
                          {feature.key_capabilities.length > 3 && (
                            <li className="text-xs text-gray-500 italic">+{feature.key_capabilities.length - 3} more capabilities</li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Roadmap Phases */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600" />
                <CardTitle>Roadmap Phases</CardTitle>
              </div>
              <CardDescription>
                Strategic product development across 5 phases (Months 1-36) targeting $1.5M-$2.5M MRR
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.roadmap_phases.map((phase) => (
                  <Card 
                    key={phase.phase}
                    className={`border-2 cursor-pointer transition-all ${
                      selectedPhase === phase.phase 
                        ? 'border-blue-500 shadow-lg' 
                        : 'border-gray-200 hover:border-blue-400'
                    }`}
                    onClick={() => setSelectedPhase(selectedPhase === phase.phase ? null : phase.phase)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={`${getStatusColor(`Phase ${phase.phase}`)} text-white`}>
                              Phase {phase.phase}
                            </Badge>
                            <CardTitle className="text-lg">{phase.name}</CardTitle>
                          </div>
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {phase.timeline}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              {phase.target_mrr}
                            </span>
                          </div>
                        </div>
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        <strong>Focus:</strong> {phase.focus}
                      </p>
                    </CardHeader>

                    {selectedPhase === phase.phase && (
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {phase.products.map((product, idx) => (
                            <Card key={idx} className="border-blue-200 bg-blue-50/30">
                              <CardHeader>
                                <CardTitle className="text-sm">{product.name}</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <p className="text-xs text-gray-700">{product.description}</p>
                                
                                <div>
                                  <p className="text-xs font-semibold text-gray-600 mb-1">Lifecycle Stages:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {product.lifecycle_stages.map((stage) => (
                                      <Badge key={stage} variant="outline" className="text-xs">
                                        {stage}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs font-semibold text-gray-600 mb-1">Target Stakeholders:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {product.stakeholders.map((stakeholder) => (
                                      <Badge key={stakeholder} variant="outline" className="text-xs bg-blue-50">
                                        {stakeholder}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs font-semibold text-gray-600 mb-1">Key Features:</p>
                                  <ul className="space-y-0.5">
                                    {product.key_features.slice(0, 3).map((feature, fidx) => (
                                      <li key={fidx} className="text-xs text-gray-600 flex items-start gap-1">
                                        <span className="text-blue-600 mt-0.5">•</span>
                                        <span>{feature}</span>
                                      </li>
                                    ))}
                                    {product.key_features.length > 3 && (
                                      <li className="text-xs text-gray-500 italic">+{product.key_features.length - 3} more features</li>
                                    )}
                                  </ul>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LIFECYCLE STAGE VIEW TAB */}
        <TabsContent value="lifecycle" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-600" />
                <CardTitle>Stakeholder Integration by Lifecycle Stage</CardTitle>
              </div>
              <CardDescription>
                Comprehensive onboarding plans showing how each stakeholder integrates across the six lifecycle stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.lifecycle_stages.map((stage) => (
                  <Card 
                    key={stage.stage}
                    className={`border-2 cursor-pointer transition-all ${
                      selectedStage === stage.stage 
                        ? 'border-purple-500 shadow-lg' 
                        : 'border-gray-200 hover:border-purple-400'
                    }`}
                    onClick={() => setSelectedStage(selectedStage === stage.stage ? null : stage.stage)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-purple-600 text-white">{stage.stage}</Badge>
                            <CardTitle className="text-lg">{stage.name}</CardTitle>
                          </div>
                          <p className="text-sm text-gray-700">{stage.description}</p>
                          <p className="text-sm text-gray-600 mt-2">
                            {stage.stakeholders.length} stakeholder{stage.stakeholders.length !== 1 ? 's' : ''} integrated
                          </p>
                        </div>
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                    </CardHeader>

                    {selectedStage === stage.stage && (
                      <CardContent className="space-y-3">
                        {stage.stakeholders.map((stakeholder, idx) => (
                          <Card key={idx} className="border-purple-200 bg-purple-50/30">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-sm">{stakeholder.name}</CardTitle>
                                  <p className="text-xs text-gray-600 mt-1">{stakeholder.role}</p>
                                </div>
                                <Badge className={getIntegrationStatusColor(stakeholder.integration_status)}>
                                  {stakeholder.integration_status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">Onboarding Plan:</p>
                                <p className="text-xs text-gray-700">{stakeholder.onboarding_plan}</p>
                              </div>
                              
                              <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">Products:</p>
                                <div className="flex flex-wrap gap-1">
                                  {stakeholder.products.map((product) => (
                                    <Badge key={product} variant="outline" className="text-xs">
                                      {product}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STAKEHOLDER VIEW TAB - ENHANCED WITH ALL 22 STAKEHOLDERS */}
        <TabsContent value="stakeholders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-green-600" />
                <CardTitle>Stakeholder Integration & Revenue Model</CardTitle>
              </div>
              <CardDescription>
                Complete roadmap coverage for all {stakeholderRoadmap.length} ecosystem stakeholders with released products and planned integrations for revenue modeling and onboarding timelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stakeholderRoadmap.map((stakeholder) => {
                  const totalProducts = stakeholder.products.released.length + stakeholder.products.roadmap.length;
                  const hasReleased = stakeholder.products.released.length > 0;
                  const hasRoadmap = stakeholder.products.roadmap.length > 0;

                  return (
                    <Card 
                      key={stakeholder.id}
                      className={`border-2 cursor-pointer transition-all ${
                        selectedStakeholder === stakeholder.displayName
                          ? 'border-green-500 shadow-lg' 
                          : hasReleased 
                            ? 'border-green-200 hover:border-green-400' 
                            : 'border-gray-200 hover:border-blue-400'
                      }`}
                      onClick={() => setSelectedStakeholder(
                        selectedStakeholder === stakeholder.displayName ? null : stakeholder.displayName
                      )}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <Building2 className="w-5 h-5 text-green-600" />
                              <CardTitle className="text-lg">{stakeholder.displayName}</CardTitle>
                              <Badge variant="outline" className={`text-xs ${
                                hasReleased 
                                  ? 'bg-green-50 text-green-700 border-green-300' 
                                  : 'bg-blue-50 text-blue-700 border-blue-300'
                              }`}>
                                {stakeholder.revenueModel}
                              </Badge>
                            </div>
                            <div className="flex gap-3 text-sm text-gray-600 flex-wrap">
                              {hasReleased && (
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  {stakeholder.products.released.length} released
                                </span>
                              )}
                              {hasRoadmap && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4 text-blue-600" />
                                  {stakeholder.products.roadmap.length} on roadmap
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-purple-600" />
                                {stakeholder.lifecycleStages.length} lifecycle stages
                              </span>
                            </div>
                          </div>
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                      </CardHeader>

                      {selectedStakeholder === stakeholder.displayName && (
                        <CardContent className="space-y-4">
                          {/* Lifecycle Stages Coverage */}
                          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                            <p className="text-xs font-semibold text-gray-900 mb-2">Lifecycle Stages Covered</p>
                            <div className="flex flex-wrap gap-2">
                              {stakeholder.lifecycleStages.map((stage) => (
                                <Badge key={stage} className="bg-purple-600">
                                  {stage}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Released Products */}
                          {hasReleased && (
                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <p className="text-xs font-semibold text-gray-900">Released Products ({stakeholder.products.released.length})</p>
                              </div>
                              <div className="space-y-2">
                                {stakeholder.products.released.map((product, idx) => (
                                  <div key={idx} className="bg-white p-3 rounded border border-green-200">
                                    <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                                    <p className="text-xs text-gray-600 mt-1">{product.revenue}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Roadmap Products */}
                          {hasRoadmap && (
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <p className="text-xs font-semibold text-gray-900">Roadmap Products ({stakeholder.products.roadmap.length})</p>
                              </div>
                              <div className="space-y-2">
                                {stakeholder.products.roadmap.map((product, idx) => (
                                  <div key={idx} className="bg-white p-3 rounded border border-blue-200">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                      <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                                      <Badge className={`${getPhaseColor(product.phase)} text-xs shrink-0`}>
                                        {product.phase}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-600">{product.revenue}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* No Products Available */}
                          {!hasReleased && !hasRoadmap && (
                            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                              <p className="text-sm text-gray-600">No products currently planned for this stakeholder</p>
                              <p className="text-xs text-gray-500 mt-1">Future integration opportunities to be evaluated</p>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

