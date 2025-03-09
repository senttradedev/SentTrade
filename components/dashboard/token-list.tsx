import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Token {
  symbol: string;
  name: string;
  price: number;
  sentiment: "positive" | "negative" | "neutral";
  change24h: number;
}

const tokens: Token[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 43521.23,
    sentiment: "positive",
    change24h: 2.45,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 2284.12,
    sentiment: "positive",
    change24h: 3.12,
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 98.45,
    sentiment: "neutral",
    change24h: -0.82,
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    price: 34.21,
    sentiment: "negative",
    change24h: -2.15,
  },
  {
    symbol: "DOT",
    name: "Polkadot",
    price: 7.84,
    sentiment: "positive",
    change24h: 1.23,
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    price: 15.67,
    sentiment: "neutral",
    change24h: 0.45,
  },
  // Add more tokens...
];

export function TokenList({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Monitored Tokens
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-280px)] pr-4">
          <div className="space-y-2">
            {tokens.map((token) => (
              <div
                key={token.symbol}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <div className="font-semibold text-primary">
                      {token.symbol}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">{token.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ${token.price.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    variant={
                      token.sentiment === "positive"
                        ? "default"
                        : token.sentiment === "negative"
                        ? "destructive"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {token.sentiment}
                  </Badge>
                  <div
                    className={`text-sm font-medium ${
                      token.change24h >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {token.change24h > 0 ? "+" : ""}
                    {token.change24h}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
