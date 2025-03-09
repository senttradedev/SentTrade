import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Trade {
  id: string;
  type: "buy" | "sell";
  token: string;
  amount: number;
  price: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

const trades: Trade[] = [
  {
    id: "1",
    type: "buy",
    token: "BTC",
    amount: 0.5,
    price: 43521.23,
    timestamp: "2024-03-20T10:30:00Z",
    status: "completed",
  },
  {
    id: "2",
    type: "sell",
    token: "ETH",
    amount: 2.0,
    price: 2284.12,
    timestamp: "2024-03-20T09:45:00Z",
    status: "completed",
  },
  {
    id: "3",
    type: "buy",
    token: "SOL",
    amount: 15.0,
    price: 98.45,
    timestamp: "2024-03-20T08:15:00Z",
    status: "pending",
  },
  {
    id: "4",
    type: "sell",
    token: "AVAX",
    amount: 10.0,
    price: 34.21,
    timestamp: "2024-03-20T07:30:00Z",
    status: "failed",
  },
  {
    id: "5",
    type: "buy",
    token: "DOT",
    amount: 100.0,
    price: 7.84,
    timestamp: "2024-03-20T06:45:00Z",
    status: "completed",
  },
];

export function TradeHistory({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Trade History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-2">
            {trades.map((trade) => (
              <div
                key={trade.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      trade.type === "buy"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    <div className="font-semibold">
                      {trade.type === "buy" ? "BUY" : "SELL"}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">{trade.token}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(trade.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="font-medium">
                    {trade.amount} {trade.token}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    @ ${trade.price.toLocaleString()}
                  </div>
                  <Badge
                    variant={
                      trade.status === "completed"
                        ? "default"
                        : trade.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className="capitalize"
                  >
                    {trade.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
