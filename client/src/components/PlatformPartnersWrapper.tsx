import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlatformPartnersWithDialog from "./PlatformPartnersWithDialog";
import { PartnerNetworkTable } from "./PartnerNetworkTable";
import { LayoutGrid, Network } from "lucide-react";

interface Stakeholder {
  name: string;
  type: string;
  products: string[];
  status: string;
  contractExecuted: string;
  broughtOnBy: string;
  comments: string;
  lastEdited: string;
}

interface PartnerMetrics {
  revenue: {
    display: string;
    rationale: string;
    source: string | null;
  };
  volume: {
    display: string;
    rationale: string;
    source: string | null;
  };
  employees: {
    display: string;
    rationale: string;
    source: string | null;
  };
}

interface NetworkMetrics {
  segment: string;
  product: string;
  dealers: string;
  oems: string;
  upfitters: string;
  equipment_mfg: string;
  buyers: string;
}

export function PlatformPartnersWrapper() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [metrics, setMetrics] = useState<Record<string, PartnerMetrics>>({});
  const [networkData, setNetworkData] = useState<Record<string, NetworkMetrics>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [highlightPartner, setHighlightPartner] = useState<string | null>(null);

  useEffect(() => {
    // Load data with retry logic and cache-busting
    const fetchWithRetry = async (url: string, retries = 3): Promise<Response> => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url + '?v=' + Date.now());
          if (response.ok) return response;
          console.warn(`Fetch attempt ${i + 1} failed for ${url}:`, response.status);
        } catch (error) {
          console.warn(`Fetch attempt ${i + 1} error for ${url}:`, error);
          if (i === retries - 1) throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
      throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
    };

    Promise.all([
      fetchWithRetry("/stakeholders.csv").then(res => res.text()),
      fetchWithRetry("/partner-metrics.json").then(res => res.json()),
      fetchWithRetry("/partner-network.json").then(res => res.json())
    ])
      .then(([csvText, metricsData, networkDataJson]) => {
        // Parse CSV
        const lines = csvText.split("\n").filter(line => line.trim());
        
        const parsed = lines.slice(1).map((line) => {
          const values: string[] = [];
          let current = "";
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          values.push(current.trim());

          return {
            name: values[0]?.replace(/^"|"$/g, '') || "",
            type: values[1]?.replace(/^"|"$/g, '') || "",
            products: values[2]?.replace(/^"|"$/g, '').split(",").map(p => p.trim()).filter(Boolean) || [],
            status: values[3]?.replace(/^"|"$/g, '') || "",
            contractExecuted: values[4]?.replace(/^"|"$/g, '') || "",
            broughtOnBy: values[5]?.replace(/^"|"$/g, '') || "",
            comments: values[6]?.replace(/^"|"$/g, '') || "",
            lastEdited: values[7]?.replace(/^"|"$/g, '') || "",
          };
        }).filter(s => s.name);

        setStakeholders(parsed);
        setMetrics(metricsData);
        setNetworkData(networkDataJson);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading partner data:", err);
        console.error("Failed files: /stakeholders.csv, /partner-metrics.json, /partner-network.json");
        alert("Failed to load partner data. Please refresh the page.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading partners...</div>
      </div>
    );
  }

  const handlePartnerClick = (partnerName: string) => {
    setHighlightPartner(partnerName);
    setActiveTab("overview");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4" />
          Partner Overview
        </TabsTrigger>
        <TabsTrigger value="network" className="flex items-center gap-2">
          <Network className="h-4 w-4" />
          Partner Network
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-6">
        <PlatformPartnersWithDialog highlightPartner={highlightPartner} onHighlightComplete={() => setHighlightPartner(null)} />
      </TabsContent>
      
      <TabsContent value="network" className="mt-6">
        <PartnerNetworkTable 
          stakeholders={stakeholders}
          metrics={metrics}
          networkData={networkData}
          onPartnerClick={handlePartnerClick}
        />
      </TabsContent>
    </Tabs>
  );
}
