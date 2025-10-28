import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Building2, DollarSign, Users, TrendingUp, Wrench, Laptop, Megaphone } from "lucide-react";

interface KeyMetricsData {
  total_dealerships: {
    value: string;
    retail: string;
    commercial: string;
  };
  combined_annual_sales: {
    value: string;
    retail: string;
    commercial: string;
  };
  total_vehicles_sold: {
    value: string;
    retail: string;
    commercial: string;
  };
  total_repair_orders: {
    value: string;
    retail: string;
    commercial: string;
  };
  total_employees: {
    value: string;
    retail: string;
    commercial: string;
  };
  total_software_spend: {
    value: string;
    note: string;
  };
  total_advertising_spend: {
    value: string;
    retail: string;
    commercial: string;
  };
}

export default function KeyMetrics() {
  const [keyMetrics, setKeyMetrics] = useState<KeyMetricsData | null>(null);

  useEffect(() => {
    fetch('/dealer_key_metrics.json')
      .then(res => res.json())
      .then(data => setKeyMetrics(data));
  }, []);

  if (!keyMetrics) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading key metrics...</p></div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Primary Market Metrics</CardTitle>
          <CardDescription>Combined NADA + ATD dealership landscape 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Dealerships */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-4xl font-bold text-primary mb-2">{keyMetrics.total_dealerships.value}</p>
                    <p className="text-base font-semibold mb-2">Total Dealerships</p>
                    <p className="text-sm text-muted-foreground">
                      {keyMetrics.total_dealerships.retail} Retail franchised new-car • {keyMetrics.total_dealerships.commercial} Commercial truck
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Combined Annual Sales */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-4xl font-bold text-primary mb-2">{keyMetrics.combined_annual_sales.value}</p>
                    <p className="text-base font-semibold mb-2">Combined Annual Sales</p>
                    <p className="text-sm text-muted-foreground">
                      {keyMetrics.combined_annual_sales.retail} Retail • {keyMetrics.combined_annual_sales.commercial} Commercial
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Vehicles Sold */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-4xl font-bold text-primary mb-2">{keyMetrics.total_vehicles_sold.value}</p>
                    <p className="text-base font-semibold mb-2">Total Vehicles Sold</p>
                    <p className="text-sm text-muted-foreground">
                      {keyMetrics.total_vehicles_sold.retail} Light-duty (Retail) • {keyMetrics.total_vehicles_sold.commercial} Medium/Heavy-duty (Commercial)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Repair Orders */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Wrench className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-4xl font-bold text-primary mb-2">{keyMetrics.total_repair_orders.value}</p>
                    <p className="text-base font-semibold mb-2">Total Repair Orders</p>
                    <p className="text-sm text-muted-foreground">
                      {keyMetrics.total_repair_orders.retail} (Retail) • {keyMetrics.total_repair_orders.commercial} (Commercial)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Employees */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-4xl font-bold text-primary mb-2">{keyMetrics.total_employees.value}</p>
                    <p className="text-base font-semibold mb-2">Total Employees</p>
                    <p className="text-sm text-muted-foreground">
                      {keyMetrics.total_employees.retail} Retail • {keyMetrics.total_employees.commercial} Commercial
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Software Spend */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Laptop className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-4xl font-bold text-primary mb-2">{keyMetrics.total_software_spend.value}</p>
                    <p className="text-base font-semibold mb-2">Total Software Spend</p>
                    <p className="text-sm text-muted-foreground">
                      {keyMetrics.total_software_spend.note}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Advertising Spend */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Megaphone className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-4xl font-bold text-primary mb-2">{keyMetrics.total_advertising_spend.value}</p>
                    <p className="text-base font-semibold mb-2">Total Advertising Spend</p>
                    <p className="text-sm text-muted-foreground">
                      {keyMetrics.total_advertising_spend.retail} Retail • {keyMetrics.total_advertising_spend.commercial} Commercial
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

