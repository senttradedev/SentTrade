import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface TradingRecommendation {
  id: string;
  token: string;
  action: "buy" | "sell";
  confidence: number;
  reason: string;
  sentimentScore: number;
  priceTarget: number;
}

export function TradingRecommendation({
  token,
  action,
  confidence,
  reason,
  sentimentScore,
  priceTarget,
}: TradingRecommendation) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
      <div className="flex items-center gap-4">
        <div
          className={`rounded-full p-2 ${
            action === "buy"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {action === "buy" ? <ArrowUpRight /> : <ArrowDownRight />}
        </div>
        <div>
          <div className="font-medium">{token}</div>
          <div className="text-sm text-muted-foreground">{reason}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-medium">Target: ${priceTarget}</div>
          <div className="text-sm text-muted-foreground">
            Confidence: {confidence}%
          </div>
        </div>
        <Button variant="outline" size="sm">
          Execute
        </Button>
      </div>
    </div>
  );
}
