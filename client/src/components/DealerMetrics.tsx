import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ATDMetrics from "@/components/ATDMetrics";
import NADAMetrics from "@/components/NADAMetrics";
import KeyMetrics from "@/components/KeyMetrics";

export default function DealerMetrics() {

  return (
    <div className="space-y-6">
      <Tabs defaultValue="key" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="key">Key Metrics</TabsTrigger>
          <TabsTrigger value="atd">ATD (Truck Dealerships)</TabsTrigger>
          <TabsTrigger value="nada">NADA (Car Dealerships)</TabsTrigger>
          <TabsTrigger value="tech">Tech Stack</TabsTrigger>
        </TabsList>

        {/* Key Metrics Tab - Combined NADA + ATD */}
        <TabsContent value="key" className="space-y-6">
          <KeyMetrics />
        </TabsContent>

        {/* ATD Tab - Ultra Comprehensive */}
        {/* ATD Tab - Enhanced with Charts */}
        <TabsContent value="atd" className="space-y-6">
          <ATDMetrics />
        </TabsContent>

        {/* NADA Tab - Enhanced with Charts */}
        <TabsContent value="nada" className="space-y-6">
          <NADAMetrics />
        </TabsContent>

        <TabsContent value="tech" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Technology Stack Spending in Commercial Vehicle Dealerships (Class 1–8)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Avg Annual Software Spend / Dealer</p>
                  <p className="text-2xl font-bold text-primary">$224,000+</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Industry Total Software Spend</p>
                  <p className="text-2xl font-bold text-primary">$4.6B+</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Systems per Dealer</p>
                  <p className="text-2xl font-bold text-primary">6–8 systems</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Software Categories</p>
                  <p className="text-2xl font-bold text-primary">20+ categories</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Current Dealer Tech Stack</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>System</TableHead>
                      <TableHead className="text-right">Monthly Cost</TableHead>
                      <TableHead className="text-right">Share of Spend</TableHead>
                      <TableHead className="text-right">Industry Annual</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">DMS</TableCell>
                      <TableCell className="text-right">$8.5K</TableCell>
                      <TableCell className="text-right">45.6%</TableCell>
                      <TableCell className="text-right">$1.56B</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">CRM</TableCell>
                      <TableCell className="text-right">$2.5K</TableCell>
                      <TableCell className="text-right">13.4%</TableCell>
                      <TableCell className="text-right">$456M</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Inventory Management</TableCell>
                      <TableCell className="text-right">$2.1K</TableCell>
                      <TableCell className="text-right">11.2%</TableCell>
                      <TableCell className="text-right">$384M</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Digital Retailing</TableCell>
                      <TableCell className="text-right">$1.5K</TableCell>
                      <TableCell className="text-right">8.0%</TableCell>
                      <TableCell className="text-right">$274M</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Service/Repair Tools</TableCell>
                      <TableCell className="text-right">$1.3K</TableCell>
                      <TableCell className="text-right">7.0%</TableCell>
                      <TableCell className="text-right">$240M</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Website Platforms</TableCell>
                      <TableCell className="text-right">$1.7K</TableCell>
                      <TableCell className="text-right">9.1%</TableCell>
                      <TableCell className="text-right">$312M</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Marketing Tools</TableCell>
                      <TableCell className="text-right">$0.8K</TableCell>
                      <TableCell className="text-right">4.3%</TableCell>
                      <TableCell className="text-right">$147M</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">F&I Systems</TableCell>
                      <TableCell className="text-right">$0.5K</TableCell>
                      <TableCell className="text-right">2.7%</TableCell>
                      <TableCell className="text-right">$92M</TableCell>
                    </TableRow>
                    <TableRow className="font-bold bg-muted/50">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">$18.7K/mo ($224K/yr)</TableCell>
                      <TableCell className="text-right">100%</TableCell>
                      <TableCell className="text-right">$4.6B+</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Download Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Source Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <a href="/2024ATDData.pdf" download>
                <Download className="h-4 w-4 mr-2" />
                Download ATD 2024 Report
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/2024NADADataFullYear.pdf" download>
                <Download className="h-4 w-4 mr-2" />
                Download NADA 2024 Report
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

