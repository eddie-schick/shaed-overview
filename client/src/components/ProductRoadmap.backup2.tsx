import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, TrendingUp, Users, Package, Target, Building2, DollarSign, Network, Lightbulb } from "lucide-react";

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

export default function ProductRoadmap({ data }: { data: RoadmapData }) {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [selectedStakeholder, setSelectedStakeholder] = useState<string | null>(null);

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

  // Stakeholder revenue data (from Platform Partners tab)
  const stakeholderRevenueData: { [key: string]: { revenue: string; pricing: string; products: string[] } } = {
    "Dealers": {
      revenue: "$800-$10K/month",
      pricing: "Marketplace subscriptions ($800-$10K/month), Digital Deal Jacket SaaS ($500-$1.5K/month), PaperX AI ($300-$1K/month), Transaction fees (1-2%)",
      products: ["SHAED Marketplace", "Digital Deal Jackets", "PaperX AI", "Upfit Portal", "Hero Page"]
    },
    "OEMs": {
      revenue: "$500-$2K/month + leads",
      pricing: "Marketplace listing fees ($500-$2K/month), Lead generation ($100-$300 per qualified lead), Data licensing ($10K-$50K/month), API access ($5K-$15K/month)",
      products: ["SHAED Marketplace", "Hero Page", "SHAED Catalog"]
    },
    "Upfitters": {
      revenue: "$500-$8K/month",
      pricing: "Upfit Portal subscription ($500-$8K/month by revenue tier), Lead generation ($200-$500 per project), Project management fees (2-5% of project value)",
      products: ["Upfit Portal", "Digital Deal Jackets", "PaperX AI"]
    },
    "Fleet Managers": {
      revenue: "$15-$40/vehicle/month",
      pricing: "Pritchard Dashboard ($15-$40/vehicle/month with volume discounts), Procurement consulting ($5K-$50K project-based), Valuation/analytics ($1K-$10K/month)",
      products: ["Pritchard Dashboard", "SHAED Marketplace", "Upfit Portal"]
    },
    "Financial Institutions": {
      revenue: "$5K-$20K/month",
      pricing: "Lender network participation ($5K-$20K/month), Transaction fees ($100-$400 per funded deal), Commercial EV residual data ($10K-$50K/month)",
      products: ["Digital Deal Jackets", "PaperX AI", "Commercial Vehicle Valuation"]
    },
    "Body Manufacturers": {
      revenue: "$2K-$10K/year",
      pricing: "Listing fees ($2K-$10K/year) + 5-10% revenue share on facilitated sales",
      products: ["Upfit Portal", "SHAED Catalog"]
    },
    "Service Providers": {
      revenue: "$1K-$5K/month",
      pricing: "Service network integration ($1K-$5K/month), Parts/service marketplace ($500-$3K/month + 3-8% transaction fees)",
      products: ["Pritchard Dashboard", "Service Network Integration"]
    },
    "Insurance Providers": {
      revenue: "$10K-$50K/month",
      pricing: "Enterprise data licensing ($10K-$50K/month) for underwriting and claims valuation",
      products: ["Commercial Vehicle Valuation", "Market Intelligence"]
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
        <div className="flex items-start gap-4">
          <Target className="w-8 h-8 text-green-600 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">SHAED Product Roadmap</h2>
            <p className="text-gray-700">
              Comprehensive view of strategic positioning, released features, planned integrations, and stakeholder onboarding plans across the commercial vehicle lifecycle.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="roadmap">Product Roadmap</TabsTrigger>
          <TabsTrigger value="lifecycle">Lifecycle Stage View</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholder View</TabsTrigger>
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
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  Cox Automotive operates the most comprehensive vehicle lifecycle platform in the consumer automotive industry, generating billions in revenue across wholesale auctions (Manheim), retail marketplaces (Autotrader, KBB), dealer software (Dealertrack, vAuto, VinSolutions), and financial services (NextGear Capital). Through strategic acquisitions totaling $6-7 billion between 2010-2021, Cox built an unparalleled vertical integration spanning the entire consumer vehicle lifecycle with powerful network effects where each product strengthens the others.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-green-200 bg-green-50/30">
                  <CardHeader>
                    <CardTitle className="text-base">Wholesale/Inventory Layer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-700"><strong>Manheim:</strong> 70+ physical auction locations handling millions of vehicles annually</p>
                    <p className="text-sm text-gray-700"><strong>Revenue:</strong> Buyer fees ($200-600), seller fees ($75-300), transaction % (1-3%)</p>
                    <p className="text-sm text-gray-700"><strong>NextGear Capital:</strong> Inventory financing at Prime + 1-4%</p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50/30">
                  <CardHeader>
                    <CardTitle className="text-base">Retail/Consumer Layer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-700"><strong>Autotrader:</strong> $500-5K/month dealer subscriptions + lead generation fees</p>
                    <p className="text-sm text-gray-700"><strong>KBB:</strong> 90-year brand equity, dealer advertising ($15-50/lead), data licensing</p>
                    <p className="text-sm text-gray-700"><strong>Data Moat:</strong> Proprietary pricing data competitors cannot replicate</p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50/30">
                  <CardHeader>
                    <CardTitle className="text-base">Dealer Operations Layer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-700"><strong>Dealertrack:</strong> $4B acquisition, F&I transaction fees ($15-35), DMS subscriptions ($800-2.5K/month)</p>
                    <p className="text-sm text-gray-700"><strong>VinSolutions CRM:</strong> $500-2.5K/month</p>
                    <p className="text-sm text-gray-700"><strong>vAuto:</strong> Inventory management $500-5K/month</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-lg">Cox's Integration Advantage: The Data Flywheel</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    A typical medium-sized dealer (3-5 rooftops) spends <strong>$9,500-$17,500 monthly</strong> across Cox products, while large dealer groups exceed <strong>$100,000-$500,000 monthly</strong>. Single sign-on, unified dashboards, and shared data layers create enormous switching costs.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-700 font-medium">The Data Flywheel:</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Real-time auction data informs vAuto pricing algorithms → which optimize Autotrader listings → generating consumer leads managed in VinSolutions → with financing processed through Dealertrack → creating more transaction data that feeds back into the system
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="w-6 h-6 text-red-600" />
                <CardTitle>Cox's Commercial Vehicle Gap: SHAED's Opportunity</CardTitle>
              </div>
              <CardDescription>
                Despite Cox's dominance in consumer vehicles, commercial vehicles represent a massive strategic blindspot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  Despite Cox's dominance in consumer vehicles, commercial vehicles receive minimal strategic attention. Manheim operates some commercial vehicle lanes at select locations, and KBB provides limited light commercial vehicle valuation, but Cox lacks dedicated commercial infrastructure. The result is a <strong>fragmented, underserved market</strong> where fleet managers must cobble together solutions from multiple vendors with no integrated platform comparable to Cox's consumer vehicle ecosystem.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-base text-red-600">Missing Capabilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span><strong>Procurement:</strong> No RFP processes, bulk purchasing, or spec management tools</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span><strong>Upfitting:</strong> Zero presence in 20-50% of total vehicle cost</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span><strong>Compliance:</strong> No DOT, IFTA, IRP, or weight permit solutions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span><strong>Fleet Management:</strong> No telematics (Geotab 3M+ vehicles, Samsara $850M revenue)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span><strong>Lifecycle Optimization:</strong> No TCO analysis, depreciation modeling, replacement planning</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50/30">
                  <CardHeader>
                    <CardTitle className="text-base text-green-600">SHAED's Coverage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>SHAED Marketplace:</strong> Commercial EV procurement and remarketing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>Upfit Portal:</strong> Highest-value lifecycle stage (20-50% cost component)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>Digital Deal Jackets:</strong> Commercial transaction documentation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>Pritchard Dashboard:</strong> Fleet-level visibility and management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>PaperX AI:</strong> Document processing automation</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <CardTitle>Commercial EV Inflection Point: Trillion-Dollar Market Transformation</CardTitle>
              </div>
              <CardDescription>
                The most significant automotive market disruption in decades, and Cox is entirely unprepared
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  Commercial vehicle electrification represents the most significant automotive market disruption in decades. The Inflation Reduction Act provides up to <strong>$40,000 per commercial EV</strong> in tax credits, fleet managers face mounting ESG pressure, and operating cost advantages (30-40% lower than diesel for last-mile delivery) are driving rapid adoption. <strong>Goldman Sachs projects commercial EV sales reaching 40% of new commercial vehicle sales by 2030.</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Market Size</p>
                  <p className="text-2xl font-bold text-blue-600">$50B+</p>
                  <p className="text-xs text-gray-600 mt-1">Annual commercial vehicle market</p>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-2">IRA Tax Credits</p>
                  <p className="text-2xl font-bold text-green-600">$40K</p>
                  <p className="text-xs text-gray-600 mt-1">Per commercial EV vehicle</p>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-2">2030 Projection</p>
                  <p className="text-2xl font-bold text-purple-600">40%</p>
                  <p className="text-xs text-gray-600 mt-1">Of new commercial vehicle sales</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                <CardTitle>SHAED's Competitive Moat: Network Effects & Data Flywheel</CardTitle>
              </div>
              <CardDescription>
                Building the integrated platform Cox failed to create, positioned for the EV transition inflection point
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                Currently available products serving {data.released_features.length} core capabilities across the commercial vehicle lifecycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.released_features.map((feature) => (
                  <Card key={feature.id} className="border-green-200 bg-green-50/30">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{feature.name}</CardTitle>
                          <Badge className="mt-2 bg-green-600">{feature.status}</Badge>
                        </div>
                        <Package className="w-5 h-5 text-green-600" />
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
                          {feature.stakeholders.slice(0, 3).map((stakeholder) => (
                            <Badge key={stakeholder} variant="secondary" className="text-xs">
                              {stakeholder}
                            </Badge>
                          ))}
                          {feature.stakeholders.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{feature.stakeholders.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Capabilities:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {feature.key_capabilities.slice(0, 3).map((capability, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-green-600 mt-0.5">•</span>
                              <span>{capability}</span>
                            </li>
                          ))}
                          {feature.key_capabilities.length > 3 && (
                            <li className="text-gray-500 italic">
                              +{feature.key_capabilities.length - 3} more capabilities
                            </li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Roadmap Phases Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <CardTitle>Planned Integrations</CardTitle>
              </div>
              <CardDescription>
                Strategic product phases expanding stakeholder integration and platform capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.roadmap_phases.map((phase) => (
                  <Card 
                    key={phase.phase} 
                    className={`border-2 cursor-pointer transition-all ${
                      selectedPhase === phase.phase 
                        ? 'border-blue-500 shadow-lg' 
                        : 'border-blue-200 hover:border-blue-400'
                    }`}
                    onClick={() => setSelectedPhase(selectedPhase === phase.phase ? null : phase.phase)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-blue-600">Phase {phase.phase}</Badge>
                            <span className="text-sm text-gray-600">{phase.timeline}</span>
                            <Badge variant="outline" className="text-xs">{phase.target_mrr} MRR</Badge>
                          </div>
                          <CardTitle className="text-xl">{phase.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">Focus: {phase.focus}</p>
                        </div>
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                    </CardHeader>

                    {selectedPhase === phase.phase && (
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {phase.products.map((product, idx) => (
                            <Card key={idx} className="bg-blue-50/50">
                              <CardHeader>
                                <CardTitle className="text-base">{product.name}</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <p className="text-sm text-gray-700">{product.description}</p>

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
                                    {product.stakeholders.slice(0, 4).map((stakeholder) => (
                                      <Badge key={stakeholder} variant="secondary" className="text-xs">
                                        {stakeholder}
                                      </Badge>
                                    ))}
                                    {product.stakeholders.length > 4 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{product.stakeholders.length - 4} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs font-semibold text-gray-600 mb-1">Key Features:</p>
                                  <ul className="text-xs text-gray-600 space-y-1">
                                    {product.key_features.map((feature, fidx) => (
                                      <li key={fidx} className="flex items-start gap-1">
                                        <span className="text-blue-600 mt-0.5">•</span>
                                        <span>{feature}</span>
                                      </li>
                                    ))}
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
              <div className="space-y-6">
                {data.lifecycle_stages.map((stage) => (
                  <Card 
                    key={stage.stage}
                    className={`border-2 cursor-pointer transition-all ${
                      selectedStage === stage.stage 
                        ? 'border-purple-500 shadow-lg' 
                        : 'border-purple-200 hover:border-purple-400'
                    }`}
                    onClick={() => setSelectedStage(selectedStage === stage.stage ? null : stage.stage)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-purple-600">{stage.stage}</Badge>
                            <span className="text-lg font-semibold text-gray-900">{stage.name}</span>
                          </div>
                          <p className="text-sm text-gray-600">{stage.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {stage.stakeholders.length} stakeholder{stage.stakeholders.length !== 1 ? 's' : ''} integrated
                          </p>
                        </div>
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                    </CardHeader>

                    {selectedStage === stage.stage && (
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {stage.stakeholders.map((stakeholder, idx) => (
                            <Card key={idx} className="bg-purple-50/50">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-base">{stakeholder.name}</CardTitle>
                                    <p className="text-xs text-gray-600 mt-1">{stakeholder.role}</p>
                                  </div>
                                  <Badge className={getIntegrationStatusColor(stakeholder.integration_status)}>
                                    {stakeholder.integration_status}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div>
                                  <p className="text-xs font-semibold text-gray-600 mb-1">Onboarding Plan:</p>
                                  <p className="text-sm text-gray-700">{stakeholder.onboarding_plan}</p>
                                </div>

                                <div>
                                  <p className="text-xs font-semibold text-gray-600 mb-1">Products Used:</p>
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
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STAKEHOLDER VIEW TAB */}
        <TabsContent value="stakeholders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-green-600" />
                <CardTitle>Stakeholder Integration & Revenue Model</CardTitle>
              </div>
              <CardDescription>
                Detailed integration plans for each stakeholder type with comprehensive revenue linkage and onboarding strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stakeholderRevenueData).map(([stakeholder, data]) => (
                  <Card 
                    key={stakeholder}
                    className={`border-2 cursor-pointer transition-all ${
                      selectedStakeholder === stakeholder 
                        ? 'border-green-500 shadow-lg' 
                        : 'border-gray-200 hover:border-green-400'
                    }`}
                    onClick={() => setSelectedStakeholder(selectedStakeholder === stakeholder ? null : stakeholder)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Building2 className="w-5 h-5 text-green-600" />
                            <CardTitle className="text-lg">{stakeholder}</CardTitle>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                              {data.revenue}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {data.products.length} product{data.products.length !== 1 ? 's' : ''} available
                          </p>
                        </div>
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                    </CardHeader>

                    {selectedStakeholder === stakeholder && (
                      <CardContent className="space-y-4">
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                          <p className="text-xs font-semibold text-gray-900 mb-2">Revenue Model</p>
                          <p className="text-sm text-gray-700">{data.pricing}</p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-2">Available Products:</p>
                          <div className="flex flex-wrap gap-2">
                            {data.products.map((product) => (
                              <Badge key={product} className="bg-green-600">
                                {product}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

