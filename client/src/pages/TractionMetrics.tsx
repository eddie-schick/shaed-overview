import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { 
  Moon, 
  Sun, 
  TrendingUp,
  Package,
  Building2,
  DollarSign
} from "lucide-react";

interface ProductsData {
  pillars: any[];
  traction_metrics: {
    core_platform?: any;
    product_specific?: any;
    network_effects?: any;
    pritchard_impact?: any;
    growth_pipeline?: any;
    revenue_traction?: any;
    strategic_validations?: any;
    legacy_metrics?: any;
    stakeholders?: Record<string, any>;
    user_counts?: Record<string, number>;
    vehicles_tracked?: number;
    upfit_status_updates?: number;
    logins?: Record<string, any>;
    PNI_network?: Record<string, any>;
    paperx_analytics?: Record<string, any>;
  };
  last_updated: string;
}

export default function TractionMetrics() {
  const { theme, toggleTheme } = useTheme();
  const [data, setData] = useState<ProductsData | null>(null);

  useEffect(() => {
    fetch("/products-data.json")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <img 
                  src="/shaed-logo.png" 
                  alt="SHAED" 
                  className="h-8 md:h-10 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Core Platform Metrics */}
          {data.traction_metrics.core_platform && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Core Platform Metrics
                </CardTitle>
                <CardDescription>Transaction volume and scale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-3xl font-bold text-purple-500 mb-1">
                      {data.traction_metrics.core_platform.transaction_volume.vehicles_tracked.toLocaleString()}+
                    </div>
                    <div className="text-sm text-muted-foreground">Vehicles Tracked</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-2xl font-bold text-green-500 mb-1">
                      ${(data.traction_metrics.core_platform.transaction_volume.transaction_value / 1000000000).toFixed(1)}B
                    </div>
                    <div className="text-sm text-muted-foreground">Transaction Value</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-2xl font-bold text-blue-500 mb-1">
                      {data.traction_metrics.core_platform.transaction_volume.active_platform_logins.toLocaleString()}+
                    </div>
                    <div className="text-sm text-muted-foreground">Platform Logins</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-2xl font-bold text-orange-500 mb-1">
                      {data.traction_metrics.core_platform.transaction_volume.documents_processed?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-muted-foreground">Documents Processed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product-Specific Traction */}
          {data.traction_metrics.product_specific && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Product-Specific Traction
                </CardTitle>
                <CardDescription>Performance by product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Management System */}
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <h4 className="font-semibold text-lg mb-3">Order Management</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-500">{data.traction_metrics.product_specific.order_management.active_users}</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">{data.traction_metrics.product_specific.order_management.customers}</div>
                      <div className="text-sm text-muted-foreground">Customers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-500">{data.traction_metrics.product_specific.order_management.total_logins.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Logins</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-500">{data.traction_metrics.core_platform.transaction_volume.vehicles_tracked.toLocaleString()}+</div>
                      <div className="text-sm text-muted-foreground">Vehicles Tracked</div>
                    </div>
                  </div>
                </div>

                {/* Upfitter Portal */}
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <h4 className="font-semibold text-lg mb-3">Upfitter Portal</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-500">{data.traction_metrics.product_specific.upfitter_portal.active_users}</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">{data.traction_metrics.product_specific.upfitter_portal.upfitters_onboarded}</div>
                      <div className="text-sm text-muted-foreground">Upfitters</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-500">{data.traction_metrics.product_specific.upfitter_portal.total_logins.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Logins</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-500">{data.traction_metrics.product_specific.order_management.status_updates.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Status Updates</div>
                    </div>
                  </div>
                </div>

                {/* PaperX AI */}
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <h4 className="font-semibold text-lg mb-3">Documentation</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-purple-500">{data.traction_metrics.product_specific.paperx_ai.documents_processed.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Documents Processed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-500">{data.traction_metrics.product_specific.paperx_ai.files_uploaded.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Files Uploaded</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">{data.traction_metrics.product_specific.paperx_ai.total_requests.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Requests</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-500">{data.traction_metrics.product_specific.paperx_ai.success_rate.toFixed(2)}%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pritchard Companies Impact */}
          {data.traction_metrics.pritchard_impact && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Dealer Use Case
                </CardTitle>
                <CardDescription>Financial value and operational improvements delivered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Financial Value Delivered</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="text-2xl font-bold text-green-500">
                        ${(data.traction_metrics.pritchard_impact.financial_value.annual_value / 1000000).toFixed(2)}M
                      </div>
                      <div className="text-sm text-muted-foreground">Annual Value</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="text-2xl font-bold text-purple-500">
                        ${(data.traction_metrics.pritchard_impact.financial_value.interest_savings / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-muted-foreground">Interest Savings</div>
                      <div className="text-xs text-muted-foreground mt-1">{data.traction_metrics.pritchard_impact.financial_value.interest_notes}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="text-2xl font-bold text-orange-500">
                        ${(data.traction_metrics.pritchard_impact.financial_value.labor_savings / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-muted-foreground">Labor Savings</div>
                      <div className="text-xs text-muted-foreground mt-1">{data.traction_metrics.pritchard_impact.financial_value.labor_notes}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="text-2xl font-bold text-green-500">
                        ${(data.traction_metrics.pritchard_impact.financial_value.revenue_multiplier / 1000000).toFixed(2)}M
                      </div>
                      <div className="text-sm text-muted-foreground">Revenue Multiplier</div>
                      <div className="text-xs text-muted-foreground mt-1">{data.traction_metrics.pritchard_impact.financial_value.revenue_notes}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">Operational Improvements</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="text-2xl font-bold text-green-500">
                        {data.traction_metrics.pritchard_impact.operational_improvements.task_efficiency}%
                      </div>
                      <div className="text-sm text-muted-foreground">Increase in task efficiency</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="text-2xl font-bold text-green-500">
                        {data.traction_metrics.pritchard_impact.operational_improvements.satisfaction_score}/5.0
                      </div>
                      <div className="text-sm text-muted-foreground">Average internal satisfaction score</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="text-2xl font-bold text-green-500">
                        3-day
                      </div>
                      <div className="text-sm text-muted-foreground">Faster quote-to-delivery cycle (88% improvement)</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="text-2xl font-bold text-green-500">
                        {data.traction_metrics.pritchard_impact.operational_improvements.digital_storage}%
                      </div>
                      <div className="text-sm text-muted-foreground">Digital document storage with instant retrieval</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Growth Pipeline & Momentum */}
          {data.traction_metrics.growth_pipeline && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Growth Pipeline & Momentum
                </CardTitle>
                <CardDescription>Near-term opportunities and expansion potential</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-3xl font-bold text-blue-500 mb-1">
                      {data.traction_metrics.growth_pipeline.dealer_pipeline.qualified_dealers.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Qualified Dealers in Pipeline</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-3xl font-bold text-green-500 mb-1">
                      {data.traction_metrics.growth_pipeline.fleet_opportunity.total_customers.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Available Fleet Customers</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-3xl font-bold text-purple-500 mb-1">
                      {data.traction_metrics.growth_pipeline.oem_expansion.total_integration_target}
                    </div>
                    <div className="text-sm text-muted-foreground">Target OEMs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Revenue Traction */}
          {data.traction_metrics.revenue_traction && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Revenue Traction
                </CardTitle>
                <CardDescription>Current bookings and growth targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-3xl font-bold text-green-500 mb-1">
                      ${(data.traction_metrics.revenue_traction.booked_revenue_2026 / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-muted-foreground">Booked Revenue (2026)</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-2xl font-bold text-blue-500 mb-1">
                      {data.traction_metrics.revenue_traction.growth_target.dealers_by_q4_2026}
                    </div>
                    <div className="text-sm text-muted-foreground">Target Dealers by Q4 2026</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ${(data.traction_metrics.revenue_traction.growth_target.target_arr / 1000000).toFixed(1)}M ARR
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-2xl font-bold text-orange-500">
                      {data.traction_metrics.revenue_traction.growth_target.breakeven_dealers}
                    </div>
                    <div className="text-sm text-muted-foreground">Breakeven Dealers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-6">
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://shaed.ai/', '_blank')}
              className="text-sm"
            >
              SHAED Website
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://www.linkedin.com/company/shaed/', '_blank')}
              className="text-sm"
            >
              LinkedIn
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
