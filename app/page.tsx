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
  Home,
  LineChart,
  Bell,
  User,
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
    <div className="min-h-screen bg-black text-white p-6 font-['IBM_Plex_Sans']">
      {/* Header - Completely redesigned navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-[#222222] px-6 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Logo and Main Navigation */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#00E99E] w-9 h-9 rounded-lg flex items-center justify-center">
                <LineChart className="h-5 w-5 text-black" />
              </div>
              <div className="font-bold text-xl tracking-tight font-['IBM_Plex_Sans']">
                Sent<span className="text-[#00E99E]">Trade</span>
                <span className="text-gray-500 font-normal text-sm">.ai</span>
              </div>
            </div>

            <nav className="flex items-center">
              <div className="bg-[#111111] rounded-lg p-1 flex items-center">
                <Link
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#00E99E] text-black font-medium"
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-400 hover:text-white transition-colors"
                >
                  <Brain className="h-4 w-4" />
                  <span>Strategy</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-400 hover:text-white transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Social</span>
                </Link>
              </div>
            </nav>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            <div className="bg-[#111111] rounded-full px-2 py-1 flex items-center gap-1 text-xs text-gray-400">
              <div className="w-2 h-2 rounded-full bg-[#00E99E]"></div>
              <span>AI Active</span>
            </div>

            <Button className="bg-[#00E99E] text-black hover:bg-[#00E99E]/90 rounded-md px-4 h-10 font-medium">
              New Strategy
              <Brain className="ml-2 h-4 w-4" />
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative bg-[#111111] h-10 w-10 flex items-center justify-center hover:bg-[#222222]"
              >
                <Bell className="h-5 w-5 text-gray-400" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-white font-medium">3</span>
                </div>
              </Button>
            </div>

            <div className="bg-[#111111] rounded-full pl-2 pr-3 py-1 flex items-center gap-2 hover:bg-[#222222] transition-colors cursor-pointer">
              <div className="bg-[#00E99E] w-7 h-7 rounded-full flex items-center justify-center text-black font-medium text-sm">
                WS
              </div>
              <span className="text-sm">Wilbur</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-16"></div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content - 8 columns */}
        <div className="col-span-8 space-y-6">
          {/* Top Row - Portfolio and AI Insights */}
          <div className="grid grid-cols-2 gap-6">
            {/* Portfolio Value */}
            <div className="bg-[#111111] p-5 rounded-xl">
              <h2 className="text-gray-400 mb-2 text-sm font-medium">
                Portfolio Value
              </h2>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-3xl font-medium">
                  $49,825<span className="text-xl">.82</span>
                </div>
                <div className="flex gap-1">
                  <span className="px-1.5 py-0.5 text-xs bg-[#00E99E]/20 text-[#00E99E] rounded">
                    ↑1.9%
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Based on AI-driven trading strategies
              </div>
            </div>

            {/* AI Insights Summary */}
            <div className="bg-[#111111] p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-[#00E99E]" />
                <h2 className="text-gray-400 text-sm font-medium">
                  AI Strategy Performance
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00E99E]/20 rounded-xl flex items-center justify-center text-[#00E99E] font-bold">
                  A
                </div>
                <div>
                  <span className="text-xl">89</span>
                  <span className="text-gray-500">/100</span>
                  <div className="text-xs text-gray-500">Excellent</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xl text-[#00E99E]">82%</div>
                  <div className="text-xs text-gray-500">Win Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-[#111111] p-5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-gray-400 text-sm font-medium">
                Portfolio & Sentiment Trend
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs bg-black text-gray-400"
                >
                  1D
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs bg-[#00E99E]/20 text-[#00E99E]"
                >
                  1W
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs bg-black text-gray-400"
                >
                  1M
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs bg-black text-gray-400"
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
                    fill="url(#gradientGreen)"
                    fillOpacity={0.1}
                    strokeWidth={1.5}
                    yAxisId="left"
                  />
                  <Area
                    type="monotone"
                    dataKey="sentiment"
                    stroke="#00E99E"
                    fill="url(#gradientGreen)"
                    fillOpacity={0.1}
                    strokeWidth={1.5}
                    yAxisId="right"
                  />
                  <defs>
                    <linearGradient
                      id="gradientGreen"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#00E99E" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#00E99E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <div>Portfolio Value</div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[#00E99E] rounded-full"></div>
                <div>Market Sentiment</div>
              </div>
            </div>
          </div>

          {/* Latest AI Insights */}
          <div className="bg-[#111111] p-5 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#00E99E]" />
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
              <div className="flex items-start gap-3 p-3 bg-black rounded-lg">
                <div className="bg-[#00E99E]/20 p-1.5 rounded-full mt-0.5">
                  <TrendingUp className="h-3.5 w-3.5 text-[#00E99E]" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-sm">
                      Strong buy signal detected for Bitcoin
                    </div>
                    <span className="text-xs text-[#00E99E]">2m ago</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Twitter sentiment spiked 24% in the last hour with 15.2K
                    positive mentions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-black rounded-lg">
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

              <div className="flex items-start gap-3 p-3 bg-black rounded-lg">
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
          <div className="bg-[#111111] p-5 rounded-xl">
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
                <TableRow className="border-[#222222]">
                  <TableHead className="text-gray-500 text-xs font-medium">
                    Token
                  </TableHead>
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
                <TableRow className="border-[#222222]">
                  <TableCell className="flex items-center gap-2 py-2">
                    <div className="bg-[#F7931A] p-1 rounded-full">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.17-1.06-.25l.53-2.127-1.32-.33-.54 2.165c-.285-.065-.565-.13-.84-.2l-1.815-.45-.35 1.407s.975.225.955.238c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.415-.614.32.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.54 2.143 1.32.33.54-2.18c2.24.427 3.93.255 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.22 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.52 2.75 2.084v.006z"
                          fill="#ffffff"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm">Bitcoin</div>
                      <div className="text-xs text-gray-500">BTC</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#00E99E] text-sm">
                    Very Bullish
                  </TableCell>
                  <TableCell className="text-sm">Strong Buy</TableCell>
                  <TableCell className="text-sm">↑ 24.5%</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="h-7 px-3 bg-[#00E99E]/20 text-[#00E99E] hover:bg-[#00E99E]/30 text-xs"
                    >
                      Buy
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="border-[#222222]">
                  <TableCell className="flex items-center gap-2 py-2">
                    <div className="bg-[#627EEA] p-1 rounded-full">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"
                          fill="#ffffff"
                        />
                      </svg>
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
                <TableRow className="border-[#222222]">
                  <TableCell className="flex items-center gap-2 py-2">
                    <div className="bg-[#0033AD] p-1 rounded-full">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z"
                          fill="#0033AD"
                        />
                        <path
                          d="M12.23 13.6a1.63 1.63 0 110-3.26 1.63 1.63 0 010 3.26zm5.47-2.53a.86.86 0 110-1.72.86.86 0 010 1.72zm-1.81 5a.86.86 0 110-1.72.86.86 0 010 1.72zm-2.72 1.7a.86.86 0 110-1.72.86.86 0 010 1.72zm-5.82.17a.86.86 0 110-1.72.86.86 0 010 1.72zm-2.66-3.4a.86.86 0 110-1.72.86.86 0 010 1.72zm2.65-3.4a.86.86 0 110-1.72.86.86 0 010 1.72zm5.82.17a.86.86 0 110-1.72.86.86 0 010 1.72z"
                          fill="#ffffff"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm">Cardano</div>
                      <div className="text-xs text-gray-500">ADA</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    Neutral
                  </TableCell>
                  <TableCell className="text-sm">Hold</TableCell>
                  <TableCell className="text-sm">↑ 3.2%</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="h-7 px-3 bg-gray-500/20 text-gray-500 hover:bg-gray-500/30 text-xs"
                    >
                      Hold
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
          <div className="bg-[#111111] p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-4 w-4 text-[#00E99E]" />
              <h2 className="text-gray-400 text-sm font-medium">
                Market Sentiment
              </h2>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-semibold">
                78<span className="text-xl text-gray-500">/100</span>
              </div>
              <div className="bg-[#00E99E]/20 text-[#00E99E] rounded-full px-2 py-1 text-xs">
                Bullish
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span>Positive</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-black rounded-full h-1.5">
                  <div
                    className="bg-[#00E99E] h-1.5 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span>Neutral</span>
                  <span>25%</span>
                </div>
                <div className="w-full bg-black rounded-full h-1.5">
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
                <div className="w-full bg-black rounded-full h-1.5">
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
                <div className="bg-[#111111] p-2 rounded-lg text-center">
                  <div className="text-sm font-medium">Twitter</div>
                  <div className="text-xs text-[#00E99E]">+24%</div>
                </div>
                <div className="bg-[#111111] p-2 rounded-lg text-center">
                  <div className="text-sm font-medium">Reddit</div>
                  <div className="text-xs text-[#00E99E]">+18%</div>
                </div>
                <div className="bg-[#111111] p-2 rounded-lg text-center">
                  <div className="text-sm font-medium">Telegram</div>
                  <div className="text-xs text-[#00E99E]">+15%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Tokens */}
          <div className="bg-[#111111] p-5 rounded-xl">
            <h2 className="text-gray-400 text-sm font-medium mb-4">
              Top Sentiment Tokens
            </h2>
            <div className="space-y-3">
              <div className="bg-[#7FE7FF] p-3 rounded-lg text-black">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-[#F7931A] p-1 rounded-full">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.17-1.06-.25l.53-2.127-1.32-.33-.54 2.165c-.285-.065-.565-.13-.84-.2l-1.815-.45-.35 1.407s.975.225.955.238c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.415-.614.32.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.54 2.143 1.32.33.54-2.18c2.24.427 3.93.255 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.22 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.52 2.75 2.084v.006z"
                        fill="#ffffff"
                      />
                    </svg>
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

              <div className="bg-[#111111] p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-[#627EEA] p-1 rounded-full">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"
                        fill="#ffffff"
                      />
                    </svg>
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

              <div className="bg-[#111111] p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-[#0033AD] p-1 rounded-full">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z"
                        fill="#0033AD"
                      />
                      <path
                        d="M12.23 13.6a1.63 1.63 0 110-3.26 1.63 1.63 0 010 3.26zm5.47-2.53a.86.86 0 110-1.72.86.86 0 010 1.72zm-1.81 5a.86.86 0 110-1.72.86.86 0 010 1.72zm-2.72 1.7a.86.86 0 110-1.72.86.86 0 010 1.72zm-5.82.17a.86.86 0 110-1.72.86.86 0 010 1.72zm-2.66-3.4a.86.86 0 110-1.72.86.86 0 010 1.72zm2.65-3.4a.86.86 0 110-1.72.86.86 0 010 1.72zm5.82.17a.86.86 0 110-1.72.86.86 0 010 1.72z"
                        fill="#ffffff"
                      />
                    </svg>
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
          <div className="bg-[#111111] p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-[#00E99E]" />
              <h2 className="text-gray-400 text-sm font-medium">
                AI Strategy Metrics
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[#111111] p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">
                  Signal Accuracy
                </div>
                <div className="text-xl">92%</div>
                <div className="text-xs text-gray-500">Sentiment precision</div>
              </div>
              <div className="bg-[#111111] p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Risk Level</div>
                <div className="text-xl">0.68</div>
                <div className="text-xs text-gray-500">Moderate risk</div>
              </div>
            </div>
            <div className="bg-[#111111] p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-gray-400">Trading Performance</div>
                <div className="text-xs text-[#00E99E]">Last 30 days</div>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-2xl font-semibold text-[#00E99E]">
                    82%
                  </div>
                  <div className="text-xs text-gray-500">Win Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">50</div>
                  <div className="text-xs text-gray-500">Total Trades</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-[#00E99E]">
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
