import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, TrendingUp, TrendingDown } from "lucide-react";

interface Alert {
  id: string;
  type: "sentiment_shift" | "price_movement" | "volume_spike";
  token: string;
  message: string;
  timestamp: string;
  severity: "high" | "medium" | "low";
}

export function Alert({ type, token, message, timestamp, severity }: Alert) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-primary/10 p-2">
          {type === "sentiment_shift" ? (
            <Bell className="h-4 w-4 text-primary" />
          ) : type === "price_movement" ? (
            <TrendingUp className="h-4 w-4 text-primary" />
          ) : (
            <TrendingDown className="h-4 w-4 text-primary" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{token}</span>
            <Badge
              variant={
                severity === "high"
                  ? "destructive"
                  : severity === "medium"
                  ? "default"
                  : "secondary"
              }
            >
              {severity}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">{message}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(timestamp).toLocaleString()}
          </div>
        </div>
      </div>
      <Button variant="ghost" size="sm">
        View
      </Button>
    </div>
  );
}
