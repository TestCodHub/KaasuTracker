import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquareText, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MOCK_MESSAGES } from "@/lib/mock-data";

export function SMSParser({ onScanComplete }: { onScanComplete: () => void }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCount, setScannedCount] = useState(0);

  const handleScan = () => {
    setIsScanning(true);
    setScannedCount(0);

    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      setScannedCount(MOCK_MESSAGES.length);
      onScanComplete();
      toast({
        title: "Sync Complete",
        description: `Found ${MOCK_MESSAGES.length} new transactions from SMS.`,
      });
    }, 2500);
  };

  return (
    <Card className="bg-primary text-primary-foreground overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <MessageSquareText size={120} />
      </div>
      
      <CardContent className="p-6 flex flex-col gap-4 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">SMS Sync</h3>
            <p className="text-primary-foreground/80 text-sm max-w-[200px]">
              Scan messages to automatically track bank & card transactions.
            </p>
          </div>
          {scannedCount > 0 && !isScanning && (
             <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
               <CheckCircle2 size={12} /> Synced
             </div>
          )}
        </div>

        <Button 
          variant="secondary" 
          onClick={handleScan} 
          disabled={isScanning}
          className="w-full mt-2 font-medium bg-white text-primary hover:bg-white/90 border-none shadow-sm"
        >
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning Messages...
            </>
          ) : (
            <>
              <MessageSquareText className="mr-2 h-4 w-4" />
              {scannedCount > 0 ? "Scan Again" : "Scan Messages"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
