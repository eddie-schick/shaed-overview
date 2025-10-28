import { Button } from "@/components/ui/button";
import { PlatformPartnersWrapper } from "@/components/PlatformPartnersWrapper";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "wouter";
import { Moon, Sun } from "lucide-react";

export default function PlatformPartners() {
  const { theme, toggleTheme } = useTheme();

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
          <PlatformPartnersWrapper />
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
