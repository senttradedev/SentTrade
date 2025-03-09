"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LineChart } from "@/components/ui/line-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface SentimentData {
  time: string;
  overall: number;
  positive: number;
  negative: number;
  neutral: number;
  volume: number;
  confidence: number;
}

const sentimentData: SentimentData[] = [
  {
    time: "00:00",
    overall: 65,
    positive: 70,
    negative: 20,
    neutral: 10,
    volume: 1200,
    confidence: 85,
  },
  {
    time: "04:00",
    overall: 75,
    positive: 80,
    negative: 15,
    neutral: 5,
    volume: 1450,
    confidence: 82,
  },
  {
    time: "08:00",
    overall: 55,
    positive: 60,
    negative: 30,
    neutral: 10,
    volume: 980,
    confidence: 88,
  },
  {
    time: "12:00",
    overall: 80,
    positive: 85,
    negative: 10,
    neutral: 5,
    volume: 2100,
    confidence: 90,
  },
  {
    time: "16:00",
    overall: 70,
    positive: 75,
    negative: 20,
    neutral: 5,
    volume: 1800,
    confidence: 87,
  },
  {
    time: "20:00",
    overall: 60,
    positive: 65,
    negative: 25,
    neutral: 10,
    volume: 1600,
    confidence: 84,
  },
  {
    time: "24:00",
    overall: 72,
    positive: 78,
    negative: 15,
    neutral: 7,
    volume: 1350,
    confidence: 86,
  },
];

export function SentimentOverview({ className }: { className?: string }) {
  const currentSentiment =
    sentimentData[sentimentData.length - 1] || sentimentData[0];

  if (!currentSentiment) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Market Sentiment Overview</CardTitle>
          <CardDescription>No sentiment data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Market Sentiment Overview
            </CardTitle>
            <CardDescription>
              Real-time sentiment analysis from social media and news sources
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              Confidence: {currentSentiment.confidence}%
            </Badge>
            <Badge variant="outline" className="font-mono">
              Volume: {currentSentiment.volume.toLocaleString()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overall">Overall Trend</TabsTrigger>
            <TabsTrigger value="breakdown">Sentiment Split</TabsTrigger>
            <TabsTrigger value="volume">Volume Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="overall" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">
                    {currentSentiment.positive}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Positive Sentiment
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-600">
                    {currentSentiment.negative}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Negative Sentiment
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {currentSentiment.neutral}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Neutral Sentiment
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="h-[300px]">
              <LineChart
                data={sentimentData}
                dataKeys={["overall"]}
                xAxisKey="time"
                colors={["var(--primary)"]}
                yAxisFormatter={(value) => `${value}%`}
                tooltipFormatter={(value) => `${value}%`}
                showLegend={false}
              />
            </div>
          </TabsContent>
          <TabsContent value="breakdown" className="space-y-4">
            <div className="h-[300px]">
              <LineChart
                data={sentimentData}
                dataKeys={["positive", "negative", "neutral"]}
                xAxisKey="time"
                colors={["#22c55e", "#ef4444", "#64748b"]}
                yAxisFormatter={(value) => `${value}%`}
                tooltipFormatter={(value) => `${value}%`}
              />
            </div>
          </TabsContent>
          <TabsContent value="volume" className="space-y-4">
            {/* Volume analysis content */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
