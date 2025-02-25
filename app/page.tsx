"use client";

import {
  AlertTriangle,
  ChevronDown,
  Brain,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  BarChart3,
  Settings,
  ExternalLink,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample chart data
const chartData = [
  { date: "10-25", value: 48000, sentiment: 65 },
  { date: "11-1", value: 49500, sentiment: 72 },
  { date: "11-5", value: 48500, sentiment: 68 },
  { date: "11-10", value: 50000, sentiment: 78 },
  { date: "11-15", value: 49000, sentiment: 74 },
  { date: "11-20", value: 49825, sentiment: 76 },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#18181B] text-white p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-8">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-xl">≫ SentTrade</div>
            <div className="text-gray-500">.ai</div>
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="#" className="border-b border-white pb-0.5">
              Dashboard
            </Link>
            <Link href="#" className="text-gray-500">
              Strategy Builder
            </Link>
            <Link href="#" className="text-gray-500">
              Social Feeds
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="#" className="text-gray-500">
            Saved
          </Link>
          <Button className="bg-[#F5F5F5] text-black hover:bg-gray-200 rounded-full px-4 h-9">
            New Strategy
            <Brain className="ml-2 h-4 w-4" />
          </Button>
          <div className="relative">
            <div className="w-5 h-5 bg-[#2A2A2D] rounded-full flex items-center justify-center">
              <span className="text-xs text-red-500">1</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <div className="flex items-center gap-2">
              <Image
                src="/placeholder.svg"
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span>Wilbur Stroman</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content - 8 columns */}
        <div className="col-span-8 space-y-6">
          {/* Top Row - Portfolio and AI Insights */}
          <div className="grid grid-cols-2 gap-6">
            {/* Portfolio Value */}
            <div className="bg-[#2A2A2D] p-5 rounded-xl">
              <h2 className="text-gray-400 mb-2 text-sm font-medium">
                Portfolio Value
              </h2>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-3xl font-semibold">
                  $49,825<span className="text-xl">.82</span>
                </div>
                <div className="flex gap-1">
                  <span className="px-1.5 py-0.5 text-xs bg-[#4ADE80]/20 text-[#4ADE80] rounded">
                    ↑1.9%
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Based on AI-driven trading strategies
              </div>
            </div>

            {/* AI Insights Summary */}
            <div className="bg-[#2A2A2D] p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-[#4ADE80]" />
                <h2 className="text-gray-400 text-sm font-medium">
                  AI Strategy Performance
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4ADE80]/20 rounded-xl flex items-center justify-center text-[#4ADE80] font-bold">
                  A
                </div>
                <div>
                  <span className="text-xl">89</span>
                  <span className="text-gray-500">/100</span>
                  <div className="text-xs text-gray-500">Excellent</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xl text-[#4ADE80]">82%</div>
                  <div className="text-xs text-gray-500">Win Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-[#2A2A2D] p-5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-gray-400 text-sm font-medium">
                Portfolio & Sentiment Trend
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs bg-[#18181B] text-gray-400"
                >
                  1D
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs bg-[#4ADE80]/20 text-[#4ADE80]"
                >
                  1W
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs bg-[#18181B] text-gray-400"
                >
                  1M
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs bg-[#18181B] text-gray-400"
                >
                  1Y
                </Button>
              </div>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                >
                  <XAxis
                    dataKey="date"
                    stroke="#666"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#666"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={[48000, 52000]}
                    ticks={[48000, 50000, 52000]}
                    tickFormatter={(value) => `${value / 1000}k`}
                    yAxisId="left"
                  />
                  <YAxis
                    stroke="#666"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    ticks={[0, 50, 100]}
                    orientation="right"
                    yAxisId="right"
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#fff"
                    fill="url(#gradient)"
                    fillOpacity={0.1}
                    strokeWidth={1.5}
                    yAxisId="left"
                  />
                  <Area
                    type="monotone"
                    dataKey="sentiment"
                    stroke="#4ADE80"
                    fill="url(#gradientGreen)"
                    fillOpacity={0.1}
                    strokeWidth={1.5}
                    yAxisId="right"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fff" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#fff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="gradientGreen"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#4ADE80" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#4ADE80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <div>Portfolio Value</div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[#4ADE80] rounded-full"></div>
                <div>Market Sentiment</div>
              </div>
            </div>
          </div>

          {/* Latest AI Insights */}
          <div className="bg-[#2A2A2D] p-5 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#4ADE80]" />
                <h2 className="text-gray-400 text-sm font-medium">
                  Latest AI Insights
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-gray-400"
              >
                View All
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-[#18181B] rounded-lg">
                <div className="bg-[#4ADE80]/20 p-1.5 rounded-full mt-0.5">
                  <TrendingUp className="h-3.5 w-3.5 text-[#4ADE80]" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-sm">
                      Strong buy signal detected for Bitcoin
                    </div>
                    <span className="text-xs text-[#4ADE80]">2m ago</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Twitter sentiment spiked 24% in the last hour with 15.2K
                    positive mentions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#18181B] rounded-lg">
                <div className="bg-red-500/20 p-1.5 rounded-full mt-0.5">
                  <TrendingUp className="h-3.5 w-3.5 text-red-500 transform rotate-180" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-sm">
                      Negative sentiment detected for SolarCoin
                    </div>
                    <span className="text-xs text-red-500">5m ago</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Reddit posts show 68% negative sentiment with concerns about
                    recent protocol changes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#18181B] rounded-lg">
                <div className="bg-yellow-500/20 p-1.5 rounded-full mt-0.5">
                  <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-sm">
                      Ethereum sentiment shifting
                    </div>
                    <span className="text-xs text-yellow-500">12m ago</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Mixed signals detected across platforms, monitoring for
                    clear trend
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Signal Breakdown Table */}
          <div className="bg-[#2A2A2D] p-5 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm font-medium">
                Signal Breakdown
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-gray-400"
              >
                View All
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-500 text-xs">Token</TableHead>
                  <TableHead className="text-gray-500 text-xs">
                    Sentiment
                  </TableHead>
                  <TableHead className="text-gray-500 text-xs">
                    Signal
                  </TableHead>
                  <TableHead className="text-gray-500 text-xs">
                    Volume
                  </TableHead>
                  <TableHead className="text-right text-gray-500 text-xs">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-gray-800">
                  <TableCell className="flex items-center gap-2 py-2">
                    <div className="bg-[#18181B] p-1 rounded-full">
                      <Image
                        src="/placeholder.svg"
                        alt="Bitcoin"
                        width={16}
                        height={16}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <div className="text-sm">Bitcoin</div>
                      <div className="text-xs text-gray-500">BTC</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#4ADE80] text-sm">
                    Very Bullish
                  </TableCell>
                  <TableCell className="text-sm">Strong Buy</TableCell>
                  <TableCell className="text-sm">↑ 24.5%</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="h-7 px-3 bg-[#4ADE80]/20 text-[#4ADE80] hover:bg-[#4ADE80]/30 text-xs"
                    >
                      Buy
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="border-gray-800">
                  <TableCell className="flex items-center gap-2 py-2">
                    <div className="bg-[#18181B] p-1 rounded-full">
                      <Image
                        src="/placeholder.svg"
                        alt="Ethereum"
                        width={16}
                        height={16}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <div className="text-sm">Ethereum</div>
                      <div className="text-xs text-gray-500">ETH</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-yellow-500 text-sm">
                    Neutral
                  </TableCell>
                  <TableCell className="text-sm">Hold</TableCell>
                  <TableCell className="text-sm">↑ 3.2%</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="h-7 px-3 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 text-xs"
                    >
                      Hold
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="border-gray-800">
                  <TableCell className="flex items-center gap-2 py-2">
                    <div className="bg-[#18181B] p-1 rounded-full">
                      <Image
                        src="/placeholder.svg"
                        alt="SolarCoin"
                        width={16}
                        height={16}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <div className="text-sm">SolarCoin</div>
                      <div className="text-xs text-gray-500">SLR</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-red-500 text-sm">
                    Bearish
                  </TableCell>
                  <TableCell className="text-sm">Strong Sell</TableCell>
                  <TableCell className="text-sm">↓ 12.5%</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="h-7 px-3 bg-red-500/20 text-red-500 hover:bg-red-500/30 text-xs"
                    >
                      Sell
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Sidebar - 4 columns */}
        <div className="col-span-4 space-y-6">
          {/* Sentiment Overview */}
          <div className="bg-[#2A2A2D] p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-4 w-4 text-[#4ADE80]" />
              <h2 className="text-gray-400 text-sm font-medium">
                Market Sentiment
              </h2>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-semibold">
                78<span className="text-xl text-gray-500">/100</span>
              </div>
              <span className="px-2 py-1 text-xs bg-[#4ADE80]/20 text-[#4ADE80] rounded">
                Bullish
              </span>
            </div>
            <div className="space-y-3 mb-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span>Positive</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-[#18181B] rounded-full h-1.5">
                  <div
                    className="bg-[#4ADE80] h-1.5 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span>Neutral</span>
                  <span>25%</span>
                </div>
                <div className="w-full bg-[#18181B] rounded-full h-1.5">
                  <div
                    className="bg-gray-400 h-1.5 rounded-full"
                    style={{ width: "25%" }}
                  ></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span>Negative</span>
                  <span>10%</span>
                </div>
                <div className="w-full bg-[#18181B] rounded-full h-1.5">
                  <div
                    className="bg-red-500 h-1.5 rounded-full"
                    style={{ width: "10%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-800">
              <h3 className="text-xs text-gray-400 mb-2">
                Top Sentiment Sources
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#18181B] p-2 rounded-lg text-center">
                  <div className="text-sm font-medium">Twitter</div>
                  <div className="text-xs text-[#4ADE80]">+24%</div>
                </div>
                <div className="bg-[#18181B] p-2 rounded-lg text-center">
                  <div className="text-sm font-medium">Reddit</div>
                  <div className="text-xs text-[#4ADE80]">+18%</div>
                </div>
                <div className="bg-[#18181B] p-2 rounded-lg text-center">
                  <div className="text-sm font-medium">Telegram</div>
                  <div className="text-xs text-[#4ADE80]">+15%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Tokens */}
          <div className="bg-[#2A2A2D] p-5 rounded-xl">
            <h2 className="text-gray-400 text-sm font-medium mb-4">
              Top Sentiment Tokens
            </h2>
            <div className="space-y-3">
              <div className="bg-[#7FE7FF] p-3 rounded-lg text-black">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-black/10 p-1 rounded-full">
                    <Image
                      src="/placeholder.svg"
                      alt="Bitcoin"
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="font-medium text-sm">Bitcoin</div>
                      <div className="text-sm opacity-60">BTC</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-lg font-medium">92% Positive</div>
                  <div className="text-sm opacity-60">↑ 12% 24h</div>
                </div>
              </div>

              <div className="bg-[#18181B] p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-[#2A2A2D] p-1 rounded-full">
                    <Image
                      src="/placeholder.svg"
                      alt="Ethereum"
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="font-medium text-sm">Ethereum</div>
                      <div className="text-sm text-gray-500">ETH</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-lg">78% Positive</div>
                  <div className="text-sm text-gray-500">↑ 5% 24h</div>
                </div>
              </div>

              <div className="bg-[#18181B] p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-[#2A2A2D] p-1 rounded-full">
                    <Image
                      src="/placeholder.svg"
                      alt="Cardano"
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="font-medium text-sm">Cardano</div>
                      <div className="text-sm text-gray-500">ADA</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-lg">65% Positive</div>
                  <div className="text-sm text-gray-500">↑ 3% 24h</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Strategy Performance */}
          <div className="bg-[#2A2A2D] p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-[#4ADE80]" />
              <h2 className="text-gray-400 text-sm font-medium">
                AI Strategy Metrics
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[#18181B] p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">
                  Signal Accuracy
                </div>
                <div className="text-xl">92%</div>
                <div className="text-xs text-gray-500">Sentiment precision</div>
              </div>
              <div className="bg-[#18181B] p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Risk Level</div>
                <div className="text-xl">0.68</div>
                <div className="text-xs text-gray-500">Moderate risk</div>
              </div>
            </div>
            <div className="bg-[#18181B] p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-gray-400">Trading Performance</div>
                <div className="text-xs text-[#4ADE80]">Last 30 days</div>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-2xl font-semibold text-[#4ADE80]">
                    82%
                  </div>
                  <div className="text-xs text-gray-500">Win Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">50</div>
                  <div className="text-xs text-gray-500">Total Trades</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-[#4ADE80]">
                    +$1,247
                  </div>
                  <div className="text-xs text-gray-500">Profit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
