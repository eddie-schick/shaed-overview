import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, DollarSign, TrendingUp, Users, Wrench, Package, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ATDData {
  overview: any;
  advertising_marketing: any;
  payroll_employment: any;
  financial_profile: any;
  new_truck_department: any;
  used_truck_department: any;
  service_parts_department: any;
  body_shop_department: any;
  ownership_structure: any;
  facility_metrics: any;
  sales_volume_distribution: any;
  key_performance_indicators: any;
}

const COLORS = ['#2FC774', '#00F280', '#1FA05F', '#16864D', '#0D6B3B', '#045429'];

export default function ATDMetrics() {
  const [atdData, setAtdData] = useState<ATDData | null>(null);

  useEffect(() => {
    fetch('/atd_ultra_comprehensive.json')
      .then(res => res.json())
      .then(data => setAtdData(data));
  }, []);

  if (!atdData) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading ATD metrics...</p></div>;

  // Prepare chart data
  const revenueBreakdownChart = Object.entries(atdData.financial_profile.revenue_breakdown).map(([key, value]: [string, any]) => ({
    name: key.replace(/_/g, ' ').split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    value: parseFloat(value.percent.replace('%', ''))
  }));

  const expenseBreakdownChart = Object.entries(atdData.financial_profile.detailed_expenses).slice(0, 6).map(([key, value]: [string, any]) => ({
    name: key.replace(/_/g, ' ').split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    amount: parseFloat(value.per_dealer.replace(/[$MK,]/g, '')) * (value.per_dealer.includes('M') ? 1 : 0.001)
  }));

  const newTruckTrendsChart = atdData.new_truck_department.sales_trends.map((t: any) => ({
    year: t.year,
    units: parseInt(t.units),
    price: parseFloat(t.avg_price.replace(/[$K,]/g, ''))
  }));

  const usedTruckTrendsChart = atdData.used_truck_department.sales_trends.map((t: any) => ({
    year: t.year,
    units: parseInt(t.units),
    price: parseFloat(t.avg_price.replace(/[$K,]/g, ''))
  }));

  const advertisingTrendsChart = atdData.advertising_marketing.trends.map((t: any) => ({
    year: t.year,
    total: parseFloat(t.total.replace(/[$MB,]/g, ''))
  }));

  const employmentTrendsChart = atdData.payroll_employment.employment_trends.map((t: any) => ({
    year: t.year,
    employees: t.total_employees
  }));

  const bodyShopTrendsChart = atdData.body_shop_department.trends.map((t: any) => ({
    year: t.year,
    total: parseFloat(t.total.replace(/[$MB,]/g, ''))
  }));

  const ownershipStructureChart = Object.entries(atdData.ownership_structure).map(([key, value]) => ({
    name: key.replace(/_/g, '-').replace('stores', ' stores'),
    value: parseFloat(String(value).replace('%', ''))
  }));

  const salesVolumeChart = Object.entries(atdData.sales_volume_distribution).map(([key, value]) => ({
    name: key.replace(/_/g, '-').replace('units', ' units'),
    value: parseFloat(String(value).replace('%', ''))
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
          <CardDescription className="text-sm">Commercial truck dealership landscape 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Total Dealerships</p>
              <p className="text-2xl font-bold">{atdData.overview.total_dealerships.toLocaleString()}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Avg Revenue/Dealer</p>
              <p className="text-2xl font-bold text-primary">{atdData.overview.avg_revenue_per_dealer}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Total Industry Revenue</p>
              <p className="text-2xl font-bold text-primary">{atdData.overview.total_industry_revenue}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Total Employees</p>
              <p className="text-2xl font-bold">{atdData.overview.total_employees.toLocaleString()}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Avg Employees/Dealer</p>
              <p className="text-2xl font-bold">{atdData.overview.avg_employees}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Net Profit Margin</p>
              <p className="text-2xl font-bold text-green-600">{atdData.overview.net_profit_margin}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Gross Profit Margin</p>
              <p className="text-2xl font-bold text-green-600">{atdData.overview.gross_profit_margin}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">ROI</p>
              <p className="text-2xl font-bold text-green-600">{atdData.overview.roi}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Profile */}
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
              <p className="text-xl font-bold">{atdData.financial_profile.total_sales}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Gross Profit</p>
              <p className="text-xl font-bold text-green-600">{atdData.financial_profile.gross_profit}</p>
              <p className="text-xs text-muted-foreground">{atdData.financial_profile.gross_profit_percent}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Operating Expenses</p>
              <p className="text-xl font-bold text-orange-600">{atdData.financial_profile.operating_expenses}</p>
              <p className="text-xs text-muted-foreground">{atdData.financial_profile.operating_expenses_percent}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Net Profit (Before Tax)</p>
              <p className="text-xl font-bold text-green-600">{atdData.financial_profile.net_profit_before_tax}</p>
              <p className="text-xs text-muted-foreground">{atdData.financial_profile.net_profit_percent}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/10 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3 text-base">Revenue Breakdown</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={revenueBreakdownChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueBreakdownChart.map((entry, index) => (
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
                <BarChart data={expenseBreakdownChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#2FC774" />
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
                {Object.entries(atdData.financial_profile.revenue_breakdown).map(([key, value]: [string, any]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium text-sm capitalize">{key.replace(/_/g, ' ')}</TableCell>
                    <TableCell className="text-right text-sm">{value.per_dealer || value.amount}</TableCell>
                    <TableCell className="text-right text-sm">{value.industry_total || '-'}</TableCell>
                    <TableCell className="text-right text-sm">{value.percent}</TableCell>
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
                {Object.entries(atdData.financial_profile.detailed_expenses).map(([key, value]: [string, any]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium text-sm capitalize">{key.replace(/_/g, ' ')}</TableCell>
                    <TableCell className="text-right text-sm">{value.per_dealer || value.amount}</TableCell>
                    <TableCell className="text-right text-sm">{value.industry_total || '-'}</TableCell>
                    <TableCell className="text-right text-sm">{value.percent}</TableCell>
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
            Advertising & Marketing Spend
          </CardTitle>
          <CardDescription className="text-sm">Marketing spend indicators to gauge CAC pressure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Total Industry Advertising</p>
              <p className="text-xl font-bold text-primary">{atdData.advertising_marketing.total_industry_advertising}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Avg per Dealership</p>
              <p className="text-xl font-bold text-primary">{atdData.advertising_marketing.avg_per_dealership}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Ad per Class 8 New Unit</p>
              <p className="text-xl font-bold">{atdData.advertising_marketing.advertising_per_class8_unit}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">As % of Revenue</p>
              <p className="text-xl font-bold">{atdData.advertising_marketing.advertising_as_percent_revenue}</p>
            </div>
          </div>

          <div className="bg-muted/10 p-4 rounded-lg border">
            <h4 className="font-semibold mb-3 text-base">8-Year Advertising Trends</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={advertisingTrendsChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#2FC774" strokeWidth={2} name="Total Industry Spend ($M)" />
              </LineChart>
            </ResponsiveContainer>
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
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Total Annual Payroll</p>
              <p className="text-xl font-bold text-primary">{atdData.payroll_employment.total_annual_payroll}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Avg Payroll/Dealer</p>
              <p className="text-xl font-bold text-primary">{atdData.payroll_employment.avg_payroll_per_dealer}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Avg Employees</p>
              <p className="text-xl font-bold">{atdData.payroll_employment.avg_employees}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/10 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3 text-base">Employment Mix (Average Dealership)</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm">Role</TableHead>
                    <TableHead className="text-right text-sm">% of Staff</TableHead>
                    <TableHead className="text-right text-sm">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(atdData.payroll_employment.employment_mix).map(([key, value]: [string, any]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium text-sm capitalize">{key.replace(/_/g, ' ')}</TableCell>
                      <TableCell className="text-right text-sm">{value.percent}</TableCell>
                      <TableCell className="text-right text-sm">{value.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="bg-muted/10 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3 text-base">Employment Trends (2017-2024)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={employmentTrendsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="employees" stroke="#2FC774" strokeWidth={2} name="Total Industry Employees" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Truck Department */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Package className="h-6 w-6 text-primary" />
            New Truck Department
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Avg Units Sold</p>
              <p className="text-xl font-bold">{atdData.new_truck_department.avg_units_sold}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Avg Unit Price</p>
              <p className="text-xl font-bold text-primary">{atdData.new_truck_department.avg_unit_price}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Total Sales (Per Dealer)</p>
              <p className="text-xl font-bold text-primary">{atdData.new_truck_department.total_sales}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Gross Profit</p>
              <p className="text-xl font-bold text-green-600">{atdData.new_truck_department.gross_profit}</p>
              <p className="text-xs text-muted-foreground">{atdData.new_truck_department.gross_profit_percent}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Inventory Units</p>
              <p className="text-xl font-bold">{atdData.new_truck_department.inventory_units}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Inventory Value</p>
              <p className="text-xl font-bold">{atdData.new_truck_department.inventory_value}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Days Supply</p>
              <p className="text-xl font-bold">{atdData.new_truck_department.days_supply}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Floor Plan Interest</p>
              <p className="text-xl font-bold text-orange-600">{atdData.new_truck_department.floor_plan_interest}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/10 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3 text-base">Sales by Class</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm">Class</TableHead>
                    <TableHead className="text-right text-sm">% of Sales</TableHead>
                    <TableHead className="text-right text-sm">Units</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(atdData.new_truck_department.class_breakdown).map(([key, value]: [string, any]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium text-sm">{key.replace(/_/g, ' ').toUpperCase()}</TableCell>
                      <TableCell className="text-right text-sm">{value.percent}</TableCell>
                      <TableCell className="text-right text-sm">{value.units}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="bg-muted/10 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3 text-base">8-Year Sales Trends</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={newTruckTrendsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="units" stroke="#2FC774" strokeWidth={2} name="Units Sold" />
                  <Line yAxisId="right" type="monotone" dataKey="price" stroke="#00F280" strokeWidth={2} name="Avg Price ($K)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Used Truck Department */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Package className="h-6 w-6 text-primary" />
            Used Truck Department
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Avg Units Sold</p>
              <p className="text-xl font-bold">{atdData.used_truck_department.avg_units_sold}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Avg Unit Price</p>
              <p className="text-xl font-bold text-primary">{atdData.used_truck_department.avg_unit_price}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
              <p className="text-xl font-bold text-primary">{atdData.used_truck_department.total_sales}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Gross Profit</p>
              <p className="text-xl font-bold text-green-600">{atdData.used_truck_department.gross_profit}</p>
              <p className="text-xs text-muted-foreground">{atdData.used_truck_department.gross_profit_percent}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Inventory Units</p>
              <p className="text-xl font-bold">{atdData.used_truck_department.inventory_units}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Inventory Value</p>
              <p className="text-xl font-bold">{atdData.used_truck_department.inventory_value}</p>
            </div>
          </div>

          <div className="bg-muted/10 p-4 rounded-lg border">
            <h4 className="font-semibold mb-3 text-base">8-Year Sales Trends</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usedTruckTrendsChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="units" stroke="#2FC774" strokeWidth={2} name="Units Sold" />
                <Line yAxisId="right" type="monotone" dataKey="price" stroke="#00F280" strokeWidth={2} name="Avg Price ($K)" />
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
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Total Sales (Avg Dealer)</p>
              <p className="text-xl font-bold text-primary">{atdData.service_parts_department.total_sales}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Industry Total</p>
              <p className="text-xl font-bold text-primary">{atdData.service_parts_department.industry_total}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Gross Profit</p>
              <p className="text-xl font-bold text-green-600">{atdData.service_parts_department.gross_profit}</p>
              <p className="text-xs text-muted-foreground">{atdData.service_parts_department.gross_profit_percent}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Total Repair Orders</p>
              <p className="text-xl font-bold">{atdData.service_parts_department.total_repair_orders}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Avg RO Value</p>
              <p className="text-xl font-bold">{atdData.service_parts_department.avg_ro_value}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Customer Labor Rate</p>
              <p className="text-xl font-bold">{atdData.service_parts_department.customer_labor_rate}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Parts to Labor Ratio</p>
              <p className="text-xl font-bold">{atdData.service_parts_department.parts_to_labor_ratio}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Labor Sales</p>
              <p className="text-xl font-bold">{atdData.service_parts_department.labor_sales}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Parts Sales</p>
              <p className="text-xl font-bold">{atdData.service_parts_department.parts_sales}</p>
            </div>
          </div>

          <div className="bg-muted/10 p-4 rounded-lg border">
            <h4 className="font-semibold mb-3 text-base">Technician Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background p-3 rounded border">
                <p className="text-xs text-muted-foreground mb-1">Total Industry Technicians</p>
                <p className="text-lg font-bold">{atdData.service_parts_department.technicians.total_industry.toLocaleString()}</p>
              </div>
              <div className="bg-background p-3 rounded border">
                <p className="text-xs text-muted-foreground mb-1">Avg per Dealer</p>
                <p className="text-lg font-bold">{atdData.service_parts_department.technicians.avg_per_dealer}</p>
              </div>
              <div className="bg-background p-3 rounded border">
                <p className="text-xs text-muted-foreground mb-1">Avg Productivity</p>
                <p className="text-lg font-bold">{atdData.service_parts_department.technicians.avg_productivity}</p>
              </div>
              <div className="bg-background p-3 rounded border">
                <p className="text-xs text-muted-foreground mb-1">Avg Annual Compensation</p>
                <p className="text-lg font-bold">{atdData.service_parts_department.technicians.avg_annual_compensation}</p>
              </div>
            </div>
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
                  {Object.entries(atdData.service_parts_department.labor_breakdown).map(([key, value]: [string, any]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium text-sm capitalize">{key.replace(/_/g, ' ')}</TableCell>
                      <TableCell className="text-right text-sm">{value.percent}</TableCell>
                      <TableCell className="text-right text-sm">{value.per_dealer || value.amount}</TableCell>
                      <TableCell className="text-right text-sm">{value.industry_total || '-'}</TableCell>
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
                  {Object.entries(atdData.service_parts_department.parts_breakdown).map(([key, value]: [string, any]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium text-sm capitalize">{key.replace(/_/g, ' ')}</TableCell>
                      <TableCell className="text-right text-sm">{value.percent}</TableCell>
                      <TableCell className="text-right text-sm">{value.per_dealer || value.amount}</TableCell>
                      <TableCell className="text-right text-sm">{value.industry_total || '-'}</TableCell>
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
          <CardTitle className="text-xl">Body Shop Department</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Dealerships with Shop</p>
              <p className="text-xl font-bold">{atdData.body_shop_department.dealerships_with_shop}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Total Industry Sales</p>
              <p className="text-xl font-bold text-primary">{atdData.body_shop_department.total_industry_sales}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Avg Sales per Shop</p>
              <p className="text-xl font-bold text-primary">{atdData.body_shop_department.avg_sales_per_shop}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Gross Profit %</p>
              <p className="text-xl font-bold text-green-600">{atdData.body_shop_department.gross_profit_percent}</p>
            </div>
          </div>

          <div className="bg-muted/10 p-4 rounded-lg border">
            <h4 className="font-semibold mb-3 text-base">8-Year Sales Trends</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bodyShopTrendsChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#2FC774" name="Total Industry Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Ownership Structure & Sales Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Ownership Structure</CardTitle>
            <CardDescription className="text-sm">Distribution by store count</CardDescription>
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
            <CardDescription className="text-sm">Share by annual unit volume</CardDescription>
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
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Building2 className="h-6 w-6 text-primary" />
              Facility Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/10 p-4 rounded-lg border space-y-3">
              {Object.entries(atdData.facility_metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="font-semibold text-sm">{typeof value === 'number' ? value.toLocaleString() : String(value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="h-6 w-6 text-primary" />
              Key Performance Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/10 p-4 rounded-lg border space-y-3">
              {Object.entries(atdData.key_performance_indicators).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="font-semibold text-sm">{typeof value === 'number' ? value.toLocaleString() : String(value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

