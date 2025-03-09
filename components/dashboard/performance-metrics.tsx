import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Wallet,
  Clock,
  Target,
} from "lucide-react";

const metrics = [
  {
    title: "Total Portfolio Value",
    value: "$124,532.23",
    change: "+12.5%",
    isPositive: true,
    icon: Wallet,
  },
  {
    title: "24h Profit/Loss",
    value: "$1,234.56",
    change: "+2.3%",
    isPositive: true,
    icon: TrendingUp,
  },
  {
    title: "30d Success Rate",
    value: "78%",
    change: "+5.2%",
    isPositive: true,
    icon: Target,
  },
  {
    title: "Avg. Hold Time",
    value: "3.2 days",
    change: "-0.5 days",
    isPositive: false,
    icon: Clock,
  },
  // Add more metrics...
];

export function PerformanceMetrics({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {metrics.map((metric) => (
            <div
              key={metric.title}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-lg">
                  <metric.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </div>
                  <div className="text-xl font-semibold">{metric.value}</div>
                </div>
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  metric.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {metric.isPositive ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {metric.change}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
