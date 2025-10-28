import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Building2, DollarSign, Users, TrendingUp, Wrench, Package, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#2FC774', '#00F280', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'];

interface NADAData {
  overview: any;
  financial_profile: any;
  revenue_breakdown: any[];
  operating_expenses_breakdown: any[];
  advertising_marketing: any;
  payroll_employment: any;
  new_vehicle_department: any;
  used_vehicle_department: any;
  service_parts_department: any;
  body_shop_department: any;
  ownership_structure: any;
  sales_volume_distribution: any;
  facility_metrics: any;
  key_performance_indicators: any;
}

export default function NADAMetrics() {
  const [nadaData, setNadaData] = useState<NADAData | null>(null);

  useEffect(() => {
    fetch('/nada_ultra_comprehensive.json')
      .then(res => res.json())
      .then(data => setNadaData(data));
  }, []);

  if (!nadaData) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading NADA metrics...</p></div>;

  // Prepare chart data
  const ownershipStructureChart = Object.entries(nadaData.ownership_structure).map(([key, value]: [string, any]) => ({
    name: key.replace(/_/g, ' ').split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    value: value.percentage,
    count: value.count
  }));

  const salesVolumeChart = Object.entries(nadaData.sales_volume_distribution).map(([key, value]: [string, any]) => ({
    name: key.replace(/_/g, ' ').replace('units', 'Units'),
    value: value.percentage,
    count: value.count
  }));

  return (
    <div className="space-y-6">
      {/* Industry Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-6 w-6 text-primary" />
            Industry Overview
          </CardTitle>
          <CardDescription className="text-sm">New light-vehicle dealership landscape 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Dealerships", value: nadaData.overview.total_dealerships.toLocaleString() },
              { label: "Avg Revenue/Dealer", value: nadaData.overview.avg_revenue_per_dealer, highlight: true },
              { label: "Total Industry Revenue", value: nadaData.overview.total_industry_revenue, highlight: true },
              { label: "Total Employees", value: nadaData.overview.total_employees.toLocaleString() },
              { label: "Avg Employees/Dealer", value: nadaData.overview.avg_employees },
              { label: "Net Profit Margin", value: nadaData.overview.net_profit_margin, green: true },
              { label: "Gross Profit Margin", value: nadaData.overview.gross_profit_margin, green: true },
              { label: "ROI", value: nadaData.overview.roi, green: true }
            ].map((item, idx) => (
              <div key={idx} className="bg-muted/30 p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                <p className={`text-2xl font-bold ${item.highlight ? 'text-primary' : ''} ${item.green ? 'text-green-600' : ''}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Profile with Revenue Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="h-6 w-6 text-primary" />
            Financial Profile
          </CardTitle>
          <CardDescription className="text-sm">Average dealership financial performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
              <p className="text-xl font-bold">{nadaData.financial_profile.total_sales.per_dealer}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Gross Profit</p>
              <p className="text-xl font-bold text-green-600">{nadaData.financial_profile.gross_profit.per_dealer}</p>
              <p className="text-xs text-muted-foreground">19.3%</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Operating Expenses</p>
              <p className="text-xl font-bold text-orange-600">{nadaData.financial_profile.operating_expenses.per_dealer}</p>
              <p className="text-xs text-muted-foreground">17.7%</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Net Profit (Before Tax)</p>
              <p className="text-xl font-bold text-green-600">{nadaData.financial_profile.net_profit.per_dealer}</p>
              <p className="text-xs text-muted-foreground">2.9%</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/10 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3 text-base">Revenue Breakdown</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={nadaData.revenue_breakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {nadaData.revenue_breakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-muted/10 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3 text-base">Top Operating Expenses</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={nadaData.operating_expenses_breakdown.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#2FC774" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-muted/10 p-4 rounded-lg border">
            <h4 className="font-semibold mb-3 text-base">Revenue Breakdown (Detailed)</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-sm">Department</TableHead>
                  <TableHead className="text-right text-sm">Per Dealer</TableHead>
                  <TableHead className="text-right text-sm">Industry Total</TableHead>
                  <TableHead className="text-right text-sm">% of Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nadaData.revenue_breakdown.map((item: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium text-sm capitalize">{item.category}</TableCell>
                    <TableCell className="text-right text-sm">{item.per_dealer}</TableCell>
                    <TableCell className="text-right text-sm">{item.industry_total || '-'}</TableCell>
                    <TableCell className="text-right text-sm">{item.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-muted/10 p-4 rounded-lg border">
            <h4 className="font-semibold mb-3 text-base">Detailed Operating Expenses</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-sm">Expense Category</TableHead>
                  <TableHead className="text-right text-sm">Per Dealer</TableHead>
                  <TableHead className="text-right text-sm">Industry Total</TableHead>
                  <TableHead className="text-right text-sm">% of Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nadaData.operating_expenses_breakdown.map((item: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium text-sm capitalize">{item.category}</TableCell>
                    <TableCell className="text-right text-sm">{item.per_dealer}</TableCell>
                    <TableCell className="text-right text-sm">{item.industry_total || '-'}</TableCell>
                    <TableCell className="text-right text-sm">{item.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>


      {/* Advertising & Marketing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-6 w-6 text-primary" />
            Advertising & Marketing
          </CardTitle>
          <CardDescription className="text-sm">Marketing spend and distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Total Spend/Dealer", value: nadaData.advertising_marketing.total_spend_per_dealer },
              { label: "Industry Total", value: nadaData.advertising_marketing.total_industry_spend },
              { label: "Spend/New Vehicle", value: nadaData.advertising_marketing.spend_per_new_vehicle },
              { label: "Spend/Used Vehicle", value: nadaData.advertising_marketing.spend_per_used_vehicle },
              { label: "Digital Marketing", value: `${nadaData.advertising_marketing.digital_marketing_percentage}%` },
              { label: "Traditional Marketing", value: `${nadaData.advertising_marketing.traditional_marketing_percentage}%` }
            ].map((item, idx) => (
              <div key={idx} className="bg-muted/30 p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                <p className="text-xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payroll & Employment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="h-6 w-6 text-primary" />
            Payroll & Employment
          </CardTitle>
          <CardDescription className="text-sm">Workforce composition and compensation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Payroll/Dealer", value: nadaData.payroll_employment.total_payroll_per_dealer },
              { label: "Industry Payroll", value: nadaData.payroll_employment.total_industry_payroll },
              { label: "Employees/Dealer", value: nadaData.payroll_employment.avg_employees_per_dealer },
              { label: "Total Industry Employees", value: nadaData.payroll_employment.total_industry_employees.toLocaleString() }
            ].map((item, idx) => (
              <div key={idx} className="bg-muted/30 p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                <p className="text-xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-muted/10 p-4 rounded-lg border">
            <h4 className="font-semibold text-base mb-3">Employee Distribution</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(nadaData.payroll_employment.employee_breakdown).map(([role, data]: [string, any], idx) => (
                <div key={idx} className="bg-muted/30 p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">{role}</p>
                  <p className="text-xl font-bold">{data.count}</p>
                  <p className="text-xs text-muted-foreground">{data.percentage}%</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Vehicle Department */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Package className="h-6 w-6 text-primary" />
            New Vehicle Department
          </CardTitle>
          <CardDescription className="text-sm">New vehicle sales performance and trends</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Sales/Dealer", value: nadaData.new_vehicle_department.sales_per_dealer },
              { label: "Industry Total", value: nadaData.new_vehicle_department.industry_total },
              { label: "Units/Dealer", value: nadaData.new_vehicle_department.units_sold_per_dealer },
              { label: "Total Units", value: nadaData.new_vehicle_department.total_industry_units.toLocaleString() },
              { label: "Avg Price/Unit", value: nadaData.new_vehicle_department.avg_price_per_unit },
              { label: "Gross Profit/Unit", value: nadaData.new_vehicle_department.gross_profit_per_unit },
              { label: "Inventory Days", value: nadaData.new_vehicle_department.inventory_days_supply }
            ].map((item, idx) => (
              <div key={idx} className="bg-muted/30 p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                <p className="text-xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-muted/10 p-4 rounded-lg border">
            <h4 className="font-semibold text-base mb-3">8-Year Trends</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={nadaData.new_vehicle_department.trends_8year}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="units" stroke="#2FC774" name="Units Sold" />
                <Line yAxisId="right" type="monotone" dataKey="avg_price" stroke="#00F280" name="Avg Price ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Used Vehicle Department */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Package className="h-6 w-6 text-primary" />
            Used Vehicle Department
          </CardTitle>
          <CardDescription className="text-sm">Used vehicle sales performance and trends</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Sales/Dealer", value: nadaData.used_vehicle_department.sales_per_dealer },
              { label: "Industry Total", value: nadaData.used_vehicle_department.industry_total },
              { label: "Units/Dealer", value: nadaData.used_vehicle_department.units_sold_per_dealer },
              { label: "Total Units", value: nadaData.used_vehicle_department.total_industry_units.toLocaleString() },
              { label: "Avg Price/Unit", value: nadaData.used_vehicle_department.avg_price_per_unit },
              { label: "Gross Profit/Unit", value: nadaData.used_vehicle_department.gross_profit_per_unit },
              { label: "Inventory Days", value: nadaData.used_vehicle_department.inventory_days_supply },
              { label: "", value: "" }
            ].filter(item => item.label).map((item, idx) => (
              <div key={idx} className="bg-muted/30 p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                <p className="text-xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-muted/10 p-4 rounded-lg border">
            <h4 className="font-semibold text-base mb-3">8-Year Trends</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={nadaData.used_vehicle_department.trends_8year}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="units" stroke="#2FC774" name="Units Sold" />
                <Line yAxisId="right" type="monotone" dataKey="avg_price" stroke="#00F280" name="Avg Price ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Service & Parts Department */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Wrench className="h-6 w-6 text-primary" />
            Service & Parts Department
          </CardTitle>
          <CardDescription className="text-sm">Service and parts revenue breakdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Sales/Dealer", value: nadaData.service_parts_department.total_sales_per_dealer },
              { label: "Industry Total", value: nadaData.service_parts_department.total_industry_sales },
              { label: "Labor Sales/Dealer", value: nadaData.service_parts_department.labor_sales_per_dealer },
              { label: "Labor Industry", value: nadaData.service_parts_department.labor_industry_total },
              { label: "Parts Sales/Dealer", value: nadaData.service_parts_department.parts_sales_per_dealer },
              { label: "Parts Industry", value: nadaData.service_parts_department.parts_industry_total },
              { label: "Technicians/Dealer", value: nadaData.service_parts_department.technician_count_per_dealer },
              { label: "Total Technicians", value: nadaData.service_parts_department.total_industry_technicians.toLocaleString() },
              { label: "Avg Labor Rate", value: nadaData.service_parts_department.avg_labor_rate },
              { label: "Repair Orders/Month", value: nadaData.service_parts_department.repair_orders_per_month },
              { label: "Customer Pay %", value: `${nadaData.service_parts_department.customer_pay_percentage}%` },
              { label: "Warranty %", value: `${nadaData.service_parts_department.warranty_percentage}%` }
            ].map((item, idx) => (
              <div key={idx} className="bg-muted/30 p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                <p className="text-xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/10 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3 text-base">Labor Sales Breakdown</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm">Type</TableHead>
                    <TableHead className="text-right text-sm">% of Labor</TableHead>
                    <TableHead className="text-right text-sm">Per Dealer</TableHead>
                    <TableHead className="text-right text-sm">Industry Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nadaData.service_parts_department.labor_breakdown.map((item: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium text-sm">{item.type}</TableCell>
                      <TableCell className="text-right text-sm">{item.percentage}%</TableCell>
                      <TableCell className="text-right text-sm">{item.per_dealer}</TableCell>
                      <TableCell className="text-right text-sm">{item.industry_total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="bg-muted/10 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3 text-base">Parts Sales Breakdown</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm">Type</TableHead>
                    <TableHead className="text-right text-sm">% of Parts</TableHead>
                    <TableHead className="text-right text-sm">Per Dealer</TableHead>
                    <TableHead className="text-right text-sm">Industry Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nadaData.service_parts_department.parts_breakdown.map((item: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium text-sm">{item.type}</TableCell>
                      <TableCell className="text-right text-sm">{item.percentage}%</TableCell>
                      <TableCell className="text-right text-sm">{item.per_dealer}</TableCell>
                      <TableCell className="text-right text-sm">{item.industry_total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Body Shop Department */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Wrench className="h-6 w-6 text-primary" />
            Body Shop Department
          </CardTitle>
          <CardDescription className="text-sm">Body shop operations and trends</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Penetration Rate</p>
              <p className="text-2xl font-bold">{nadaData.body_shop_department.penetration_percentage}%</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Avg Sales (w/ Body Shop)</p>
              <p className="text-2xl font-bold">{nadaData.body_shop_department.avg_sales_per_dealer_with_bodyshop}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Industry Total</p>
              <p className="text-2xl font-bold">{nadaData.body_shop_department.total_industry_sales}</p>
            </div>
          </div>
          <div className="bg-muted/10 p-4 rounded-lg border">
            <h4 className="font-semibold text-base mb-3">8-Year Trends</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={nadaData.body_shop_department.trends_8year}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="penetration" stroke="#2FC774" name="Penetration %" />
                <Line yAxisId="right" type="monotone" dataKey="avg_sales" stroke="#00F280" name="Avg Sales ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Ownership Structure & Sales Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Ownership Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/10 p-4 rounded-lg border">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ownershipStructureChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ownershipStructureChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#2FC774', '#00F280', '#4ADE80', '#86EFAC'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Sales Volume Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/10 p-4 rounded-lg border">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={salesVolumeChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {salesVolumeChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#2FC774', '#00F280', '#4ADE80', '#86EFAC', '#34D399', '#6EE7B7'][index % 6]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Facility Metrics & KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Facility Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Facility Size", value: `${nadaData.facility_metrics.avg_facility_size_sqft.toLocaleString()} sq ft` },
                { label: "Lot Size", value: `${nadaData.facility_metrics.avg_lot_size_acres} acres` },
                { label: "Showroom Size", value: `${nadaData.facility_metrics.avg_showroom_size_sqft.toLocaleString()} sq ft` },
                { label: "Service Bays", value: nadaData.facility_metrics.avg_service_bays },
                { label: "Body Shop Bays", value: nadaData.facility_metrics.avg_body_shop_bays }
              ].map((item, idx) => (
                <div key={idx} className="bg-muted/30 p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Inventory Turnover (New)", value: nadaData.key_performance_indicators.inventory_turnover_new },
                { label: "Inventory Turnover (Used)", value: nadaData.key_performance_indicators.inventory_turnover_used },
                { label: "Service Absorption", value: nadaData.key_performance_indicators.service_absorption_rate },
                { label: "Customer Retention", value: nadaData.key_performance_indicators.customer_retention_rate },
                { label: "Employee Retention", value: nadaData.key_performance_indicators.employee_retention_rate },
                { label: "Avg Transaction Time (New)", value: nadaData.key_performance_indicators.avg_transaction_time_new }
              ].map((item, idx) => (
                <div key={idx} className="bg-muted/30 p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

