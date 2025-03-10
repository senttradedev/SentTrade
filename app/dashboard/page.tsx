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
  Wallet,
  LogOut,
  Loader2,
  InfoIcon,
  RefreshCw,
  HelpCircle,
  Settings2,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
  ReferenceArea,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWallet } from "../providers";
import { useRouter } from "next/navigation";
import axios from "axios";
import { WalletDropdown } from "../components/wallet-dropdown";
import { strategyActions, metricsActions } from "@/lib/contracts";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Update the chart data to match our portfolio value
const chartData = [
  { date: "10-25", value: 8500, sentiment: 65 },
  { date: "11-1", value: 9100, sentiment: 72 },
  { date: "11-5", value: 8900, sentiment: 68 },
  { date: "11-10", value: 9400, sentiment: 78 },
  { date: "11-15", value: 9600, sentiment: 74 },
  { date: "11-20", value: 9876.08, sentiment: 76 },
];

// Add this interface for token data
interface TokenData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
}

// Define types for our data
interface TokenMetric {
  symbol: string;
  price: string;
  volume24h: string;
  liquidity: string;
  volatility: string;
  sentiment: number;
}

interface StrategyMetric {
  id: number;
  name: string;
  performance: string;
  signalCount: number;
  riskLevel: number;
  sentiment: "bullish" | "bearish" | "neutral";
}

// Add this component for network status
const NetworkStatus = () => {
  const [status, setStatus] = useState("connected");
  const [latency, setLatency] = useState(32);

  // Simulate network checks
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 50) + 20);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          status === "connected" ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
      <span className="text-xs text-gray-400">{latency}ms</span>
    </div>
  );
};

// Add this component for last updated timestamp
const LastUpdated = () => {
  const [time, setTime] = useState(new Date());

  const refreshData = () => {
    setTime(new Date());
    // Simulate data refresh
    toast.success("Data refreshed successfully");
  };

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <span>Last updated: {time.toLocaleTimeString()}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={refreshData}
      >
        <RefreshCw className="h-3 w-3" />
      </Button>
    </div>
  );
};

// Add this component for price movement indicators
const PriceMovement = ({
  value,
  isPositive,
}: {
  value: number;
  isPositive: boolean;
}) => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`
      ${isPositive ? "text-green-500" : "text-red-500"}
      ${blink ? "opacity-100" : "opacity-70"}
      transition-opacity duration-500
    `}
    >
      {value}
    </span>
  );
};

// Add this enhanced chart component
const InteractiveChart = ({ data, height = 200 }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [startIndex, setStartIndex] = useState(null);
  const [endIndex, setEndIndex] = useState(null);
  const [leftZoomArea, setLeftZoomArea] = useState("dataMin");
  const [rightZoomArea, setRightZoomArea] = useState("dataMax");
  const [isZooming, setIsZooming] = useState(false);

  const handleMouseDown = (e) => {
    if (!e) return;
    setStartIndex(e.activeTooltipIndex);
    setIsZooming(true);
  };

  const handleMouseMove = (e) => {
    if (!isZooming || !e) return;
    setEndIndex(e.activeTooltipIndex);
  };

  const handleMouseUp = () => {
    if (!isZooming || startIndex === null || endIndex === null) {
      setIsZooming(false);
      setStartIndex(null);
      setEndIndex(null);
      return;
    }

    // Calculate zoom area
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);

    if (end - start > 1) {
      // Only zoom if area is large enough
      setLeftZoomArea(data[start].date);
      setRightZoomArea(data[end].date);
    }

    setIsZooming(false);
    setStartIndex(null);
    setEndIndex(null);
  };

  const resetZoom = () => {
    setLeftZoomArea("dataMin");
    setRightZoomArea("dataMax");
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-gray-700 p-3 rounded-md shadow-lg">
          <p className="text-gray-300 text-xs mb-1">{label}</p>
          <p className="text-[#00E99E] font-medium">
            ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Sentiment: {payload[0].payload.sentiment}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative">
      {leftZoomArea !== "dataMin" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetZoom}
          className="absolute top-0 right-0 z-10 text-xs text-gray-400 hover:text-white"
        >
          Reset Zoom
        </Button>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00E99E" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00E99E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#666" }}
            axisLine={{ stroke: "#333" }}
            tickLine={{ stroke: "#333" }}
            domain={[leftZoomArea, rightZoomArea]}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#666" }}
            axisLine={{ stroke: "#333" }}
            tickLine={{ stroke: "#333" }}
            domain={["auto", "auto"]}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.5} />
          <RechartsTooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#00E99E"
            fillOpacity={1}
            fill="url(#colorValue)"
            activeDot={{
              r: 6,
              stroke: "#00E99E",
              strokeWidth: 2,
              fill: "#111",
            }}
            onMouseOver={(data, index) => setActiveIndex(index)}
            onMouseOut={() => setActiveIndex(null)}
          />
          {startIndex !== null && endIndex !== null && (
            <ReferenceArea
              x1={data[Math.min(startIndex, endIndex)]?.date}
              x2={data[Math.max(startIndex, endIndex)]?.date}
              strokeOpacity={0.3}
              fill="#00E99E"
              fillOpacity={0.1}
            />
          )}
          {activeIndex !== null && (
            <ReferenceLine
              x={data[activeIndex]?.date}
              stroke="#00E99E"
              strokeDasharray="3 3"
              strokeOpacity={0.7}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function DashboardPage() {
  const { address, isConnected, disconnect } = useWallet();
  const router = useRouter();
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenMetrics, setTokenMetrics] = useState<TokenMetric[]>([]);
  const [strategies, setStrategies] = useState<StrategyMetric[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalStrategies: 0,
    activeStrategies: 0,
    avgPerformance: "0",
    totalSignals: 0,
    bullishTokens: 0,
    bearishTokens: 0,
    neutralTokens: 0,
  });
  const [portfolioData, setPortfolioData] = useState({
    totalValue: "$9,876.08",
    change24h: "+1.85%",
    assets: [
      {
        symbol: "BNB",
        name: "BNB",
        amount: "2.45",
        value: "$1,492.56",
        allocation: 15.2,
        change24h: "+2.60%",
      },
      {
        symbol: "USDT",
        name: "Tether",
        amount: "2,500.00",
        value: "$2,498.97",
        allocation: 25.5,
        change24h: "-0.00%",
      },
      {
        symbol: "USDC",
        name: "USDC",
        amount: "1,800.00",
        value: "$1,799.78",
        allocation: 18.4,
        change24h: "+0.01%",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        amount: "1.82",
        value: "$4,084.77",
        allocation: 41.7,
        change24h: "+2.09%",
      },
    ],
    transactions: [
      {
        type: "Buy",
        asset: "BNB",
        amount: "0.5",
        value: "$304.61",
        date: "2023-11-22",
        status: "Completed",
      },
      {
        type: "Sell",
        asset: "USDT",
        amount: "500.00",
        value: "$500.00",
        date: "2023-11-20",
        status: "Completed",
      },
      {
        type: "Buy",
        asset: "USDC",
        amount: "800.00",
        value: "$800.00",
        date: "2023-11-18",
        status: "Completed",
      },
      {
        type: "Swap",
        asset: "ETH → BNB",
        amount: "0.2 → 1.2",
        value: "$448.88",
        date: "2023-11-15",
        status: "Completed",
      },
    ],
    portfolios: ["0xBFE00329865547821Cfa0FC08d91b4f76e82958D"],
  });
  const [aiPerformance, setAiPerformance] = useState({
    accuracy: "78.4%",
    profitFactor: "2.3",
    winRate: "72.1%",
    avgReturn: "3.2%",
    predictions: [
      {
        asset: "ETH",
        prediction: "Bullish",
        confidence: 87,
        actual: "Bullish",
        result: "Correct",
      },
      {
        asset: "BTC",
        prediction: "Bullish",
        confidence: 92,
        actual: "Bullish",
        result: "Correct",
      },
      {
        asset: "SOL",
        prediction: "Neutral",
        confidence: 65,
        actual: "Bullish",
        result: "Incorrect",
      },
      {
        asset: "MATIC",
        prediction: "Bearish",
        confidence: 73,
        actual: "Bearish",
        result: "Correct",
      },
      {
        asset: "AVAX",
        prediction: "Neutral",
        confidence: 58,
        actual: "Neutral",
        result: "Correct",
      },
    ],
  });
  const [marketSentiment, setMarketSentiment] = useState({
    overall: "Moderately Bullish",
    score: 68,
    trends: [
      { period: "1h", change: "+0.8%", direction: "up" },
      { period: "24h", change: "+2.3%", direction: "up" },
      { period: "7d", change: "-1.2%", direction: "down" },
    ],
    indicators: [
      { name: "Social Media", value: 72, interpretation: "Bullish" },
      { name: "News Sentiment", value: 65, interpretation: "Bullish" },
      { name: "Trading Volume", value: 58, interpretation: "Neutral" },
      { name: "Market Volatility", value: 42, interpretation: "Neutral" },
      { name: "Whale Activity", value: 76, interpretation: "Bullish" },
    ],
  });
  const [signalData, setSignalData] = useState({
    recentSignals: [
      {
        asset: "ETH",
        type: "Buy",
        strength: "Strong",
        confidence: 87,
        timestamp: "2h ago",
      },
      {
        asset: "BTC",
        type: "Buy",
        strength: "Strong",
        confidence: 92,
        timestamp: "3h ago",
      },
      {
        asset: "MATIC",
        type: "Sell",
        strength: "Moderate",
        confidence: 73,
        timestamp: "5h ago",
      },
      {
        asset: "SOL",
        type: "Hold",
        strength: "Weak",
        confidence: 58,
        timestamp: "6h ago",
      },
      {
        asset: "AVAX",
        type: "Buy",
        strength: "Moderate",
        confidence: 76,
        timestamp: "8h ago",
      },
    ],
    topOpportunities: [
      {
        asset: "ETH",
        action: "Long",
        potential: "+4.2%",
        timeframe: "24h",
        risk: "Medium",
      },
      {
        asset: "BTC",
        action: "Long",
        potential: "+3.8%",
        timeframe: "24h",
        risk: "Low",
      },
      {
        asset: "AVAX",
        action: "Long",
        potential: "+7.5%",
        timeframe: "48h",
        risk: "High",
      },
    ],
  });
  const [addPortfolioOpen, setAddPortfolioOpen] = useState(false);
  const [newPortfolioAddress, setNewPortfolioAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Add this near the other state variables
  const tokenSymbols = ["ETH", "BTC", "USDC", "MATIC", "SOL", "AVAX"];

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  // Fetch token data
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              category: "ethereum-ecosystem",
              order: "market_cap_desc",
              per_page: 7,
              page: 1,
              sparkline: false,
              price_change_percentage: "24h",
            },
          }
        );
        setTokens(response.data);
      } catch (error) {
        console.error("Error fetching token data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();

    // Refresh data every 60 seconds
    const interval = setInterval(fetchTokens, 60000);
    return () => clearInterval(interval);
  }, []);

  // Load data on component mount
  useEffect(() => {
    if (isConnected) {
      loadDashboardData();
    }
  }, [isConnected]);

  // Add this useEffect hook back to load portfolios from local storage
  useEffect(() => {
    try {
      // Check if we're in a browser environment
      if (typeof window !== "undefined") {
        const savedPortfolios = localStorage.getItem("portfolios");
        console.log("Checking localStorage for portfolios:", savedPortfolios);

        if (savedPortfolios) {
          const portfolios = JSON.parse(savedPortfolios);
          console.log("Loaded portfolios:", portfolios);

          setPortfolioData((prev) => ({
            ...prev,
            portfolios,
          }));

          // If there are saved portfolios, fetch data for the first one
          if (portfolios.length > 0) {
            fetchPortfolioData(portfolios[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error loading portfolios from localStorage:", error);
    }
  }, []);

  // Load dashboard data from blockchain
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch strategies using available methods
      const count = await strategyActions.getStrategyCount();
      console.log(`Found ${count} strategies`);

      const strategiesData = [];
      // Start from 1 (not 0) since we modified the contract to start IDs from 1
      for (let i = 1; i <= count; i++) {
        try {
          const result = await strategyActions.getStrategy(i);

          // Skip strategies that don't exist
          if (!result.success && result.notFound) {
            continue;
          }

          if (result.success && result.strategy) {
            strategiesData.push(result.strategy);
          }
        } catch (error) {
          console.error(`Error loading strategy ${i}:`, error);
        }
      }

      console.log("Found", strategiesData.length, "strategies");
      setStrategies(strategiesData);

      // Fetch token metrics
      const tokenData = await metricsActions.getTokenMetrics();
      setTokenMetrics(tokenData);

      // Now that tokenMetrics is set, generate portfolio data
      if (tokenData && tokenData.length > 0) {
        const portfolioData = generatePortfolioData();
        setPortfolioData((prev) => ({
          ...portfolioData,
          portfolios: prev.portfolios, // Preserve existing portfolios
        }));

        // Generate AI performance data
        const aiPerformance = generateAiPerformance();
        setAiPerformance(aiPerformance);

        // Generate market sentiment data
        const marketSentiment = generateMarketSentiment();
        setMarketSentiment(marketSentiment);

        // Generate signal data
        const signalData = generateSignalData();
        setSignalData(signalData);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  // Format address for display (e.g., 0x1234...5678)
  const formatAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const handleDisconnect = () => {
    disconnect();
    router.push("/");
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  // Calculate sentiment score (mock data - in a real app this would come from your sentiment analysis)
  const getSentimentScore = (token: TokenData) => {
    // This is a simplified mock calculation
    const baseScore = 50 + token.price_change_percentage_24h * 2;
    const rank = Math.max(0, 100 - token.market_cap_rank * 2);
    return Math.min(99, Math.max(30, Math.round((baseScore + rank) / 2)));
  };

  // Format performance as percentage
  const formatPerformance = (performance: string) => {
    const value = parseFloat(performance) / 100;
    return `${value.toFixed(2)}%`;
  };

  // Update the generatePortfolioData function to include dummy data for BNB, USDT, and USDC
  const generatePortfolioData = () => {
    // Check if tokenMetrics is available
    if (!tokenMetrics || tokenMetrics.length === 0) {
      console.log(
        "No token metrics available yet, returning default portfolio data"
      );
      return {
        totalValue: "$0.00",
        change24h: "0.00%",
        assets: [],
        transactions: [],
        portfolios: [],
      };
    }

    // Use default values if dashboardStats is not initialized
    const avgPerf = dashboardStats.avgPerformance || "0";
    const bullishTokens = dashboardStats.bullishTokens || 0;

    // Base portfolio value on strategy performance
    const baseValue = 25000 + parseFloat(avgPerf) * 100;
    const totalValue = baseValue.toFixed(2);

    // Calculate 24h change based on sentiment
    const bullishRatio = bullishTokens / (tokenSymbols.length || 1);
    const change24h = (
      (bullishRatio - 0.5) * 5 +
      (Math.random() * 2 - 1)
    ).toFixed(2);

    // Create dummy portfolio data for specific tokens
    const assets = [
      {
        symbol: "BNB",
        name: "BNB",
        amount: "2.45",
        value: "$1,492.56",
        allocation: 15.2,
        change24h: "+2.60%",
      },
      {
        symbol: "USDT",
        name: "Tether",
        amount: "2,500.00",
        value: "$2,498.97",
        allocation: 25.5,
        change24h: "-0.00%",
      },
      {
        symbol: "USDC",
        name: "USDC",
        amount: "1,800.00",
        value: "$1,799.78",
        allocation: 18.4,
        change24h: "+0.01%",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        amount: "1.82",
        value: "$4,084.77",
        allocation: 41.7,
        change24h: "+2.09%",
      },
    ];

    // Create dummy transactions
    const transactions = [
      {
        type: "Buy",
        asset: "BNB",
        amount: "0.5",
        value: "$304.61",
        date: "2023-11-22",
        status: "Completed",
      },
      {
        type: "Sell",
        asset: "USDT",
        amount: "500.00",
        value: "$500.00",
        date: "2023-11-20",
        status: "Completed",
      },
      {
        type: "Buy",
        asset: "USDC",
        amount: "800.00",
        value: "$800.00",
        date: "2023-11-18",
        status: "Completed",
      },
      {
        type: "Swap",
        asset: "ETH → BNB",
        amount: "0.2 → 1.2",
        value: "$448.88",
        date: "2023-11-15",
        status: "Completed",
      },
    ];

    return {
      totalValue: `$${parseFloat(totalValue).toLocaleString()}`,
      change24h: `${change24h > 0 ? "+" : ""}${change24h}%`,
      assets,
      transactions,
      portfolios: [],
    };
  };

  // Generate realistic AI performance data
  const generateAiPerformance = () => {
    // Calculate accuracy based on strategy performance
    const baseAccuracy = 70 + parseFloat(dashboardStats.avgPerformance) / 100;
    const accuracy = baseAccuracy.toFixed(1);

    // Calculate profit factor based on bullish/bearish ratio
    const profitFactor = (
      1.5 +
      dashboardStats.bullishTokens / (dashboardStats.bearishTokens || 1)
    ).toFixed(1);

    // Calculate win rate based on accuracy
    const winRate = (baseAccuracy + (Math.random() * 5 - 2.5)).toFixed(1);

    // Calculate average return based on strategy performance
    const avgReturn = (
      parseFloat(dashboardStats.avgPerformance) / 100 +
      1.5
    ).toFixed(1);

    // Generate predictions based on token metrics
    const predictions = tokenMetrics.slice(0, 5).map((token) => {
      const sentiment = token.sentiment;
      let prediction, actual, result;

      // Determine prediction based on sentiment
      if (sentiment > 65) prediction = "Bullish";
      else if (sentiment < 35) prediction = "Bearish";
      else prediction = "Neutral";

      // Determine actual outcome (with some randomness for realism)
      const accuracyCheck = Math.random() * 100;
      if (accuracyCheck < baseAccuracy) {
        // Correct prediction
        actual = prediction;
        result = "Correct";
      } else {
        // Incorrect prediction
        const outcomes = ["Bullish", "Bearish", "Neutral"].filter(
          (o) => o !== prediction
        );
        actual = outcomes[Math.floor(Math.random() * outcomes.length)];
        result = "Incorrect";
      }

      return {
        asset: token.symbol,
        prediction,
        confidence: Math.round(sentiment > 50 ? sentiment : 100 - sentiment),
        actual,
        result,
      };
    });

    return {
      accuracy: `${accuracy}%`,
      profitFactor,
      winRate: `${winRate}%`,
      avgReturn: `${avgReturn}%`,
      predictions,
    };
  };

  // Generate realistic market sentiment data
  const generateMarketSentiment = () => {
    // Calculate overall sentiment based on token metrics
    const overallScore = Math.round(
      tokenMetrics.reduce((sum, token) => sum + token.sentiment, 0) /
        tokenMetrics.length
    );

    // Determine sentiment category
    let overall;
    if (overallScore > 75) overall = "Strongly Bullish";
    else if (overallScore > 60) overall = "Moderately Bullish";
    else if (overallScore > 50) overall = "Slightly Bullish";
    else if (overallScore > 40) overall = "Neutral";
    else if (overallScore > 25) overall = "Moderately Bearish";
    else overall = "Strongly Bearish";

    // Generate realistic trends
    const trends = [
      {
        period: "1h",
        change: `${(Math.random() * 2 - 0.5).toFixed(1)}%`,
        direction: Math.random() > 0.4 ? "up" : "down",
      },
      {
        period: "24h",
        change: `${(Math.random() * 4 - 1).toFixed(1)}%`,
        direction: Math.random() > 0.3 ? "up" : "down",
      },
      {
        period: "7d",
        change: `${(Math.random() * 8 - 3).toFixed(1)}%`,
        direction: Math.random() > 0.5 ? "up" : "down",
      },
    ];

    // Fix the signs to match directions
    trends.forEach((trend) => {
      const value = parseFloat(trend.change);
      trend.change = `${trend.direction === "up" ? "+" : "-"}${Math.abs(
        value
      ).toFixed(1)}%`;
    });

    // Generate realistic indicators
    const indicators = [
      {
        name: "Social Media",
        value: Math.round(overallScore + (Math.random() * 20 - 10)),
        interpretation: "", // Will be set below
      },
      {
        name: "News Sentiment",
        value: Math.round(overallScore + (Math.random() * 15 - 7)),
        interpretation: "",
      },
      {
        name: "Trading Volume",
        value: Math.round(overallScore + (Math.random() * 25 - 15)),
        interpretation: "",
      },
      {
        name: "Market Volatility",
        value: Math.round(100 - overallScore + (Math.random() * 30 - 15)),
        interpretation: "",
      },
      {
        name: "Whale Activity",
        value: Math.round(overallScore + (Math.random() * 20 - 5)),
        interpretation: "",
      },
    ];

    // Set interpretations based on values
    indicators.forEach((indicator) => {
      if (indicator.value > 65) indicator.interpretation = "Bullish";
      else if (indicator.value < 35) indicator.interpretation = "Bearish";
      else indicator.interpretation = "Neutral";
    });

    return {
      overall,
      score: overallScore,
      trends,
      indicators,
    };
  };

  // Generate realistic signal data
  const generateSignalData = () => {
    // Generate recent signals based on token metrics
    const recentSignals = tokenMetrics.slice(0, 5).map((token, index) => {
      const sentiment = token.sentiment;
      let type, strength, confidence;

      // Determine signal type based on sentiment
      if (sentiment > 70) {
        type = "Buy";
        confidence = sentiment;
        strength = sentiment > 80 ? "Strong" : "Moderate";
      } else if (sentiment < 30) {
        type = "Sell";
        confidence = 100 - sentiment;
        strength = sentiment < 20 ? "Strong" : "Moderate";
      } else {
        type = "Hold";
        confidence = 50 + Math.abs(sentiment - 50);
        strength = "Weak";
      }

      // Generate realistic timestamps
      const hours = Math.floor(Math.random() * 10) + 1;

      return {
        asset: token.symbol,
        type,
        strength,
        confidence,
        timestamp: `${hours}h ago`,
      };
    });

    // Generate top opportunities based on bullish tokens
    const bullishTokens = tokenMetrics
      .filter((token) => token.sentiment > 65)
      .sort((a, b) => b.sentiment - a.sentiment);

    const topOpportunities = bullishTokens.slice(0, 3).map((token) => {
      const potential = (
        (token.sentiment - 50) / 10 +
        Math.random() * 2
      ).toFixed(1);
      const timeframe = Math.random() > 0.5 ? "24h" : "48h";

      let risk;
      if (parseFloat(token.volatility) > 25) risk = "High";
      else if (parseFloat(token.volatility) > 15) risk = "Medium";
      else risk = "Low";

      return {
        asset: token.symbol,
        action: "Long",
        potential: `+${potential}%`,
        timeframe,
        risk,
      };
    });

    return {
      recentSignals,
      topOpportunities,
    };
  };

  // Update the fetchPortfolioData function to properly handle portfolios
  const fetchPortfolioData = async (address: string) => {
    try {
      setIsLoading(true);

      // Check if tokenMetrics is loaded
      if (!tokenMetrics || tokenMetrics.length === 0) {
        // Wait a bit and try again
        setTimeout(() => fetchPortfolioData(address), 1000);
        return;
      }

      // Generate assets based on token metrics
      const assets = tokenMetrics.slice(0, 4).map((token) => {
        const price = parseFloat(token.price.replace(/,/g, ""));
        const allocation = Math.random() * 70 + 10;
        const amount = ((25000 * (allocation / 100)) / price).toFixed(
          token.symbol === "MATIC" ? 0 : 4
        );
        const value = (parseFloat(amount) * price).toFixed(2);
        const change = (
          (token.sentiment - 50) / 10 +
          (Math.random() * 2 - 1)
        ).toFixed(1);

        return {
          symbol: token.symbol,
          name:
            token.symbol === "ETH"
              ? "Ethereum"
              : token.symbol === "BTC"
              ? "Bitcoin"
              : token.symbol === "USDC"
              ? "USD Coin"
              : token.symbol === "MATIC"
              ? "Polygon"
              : token.symbol === "SOL"
              ? "Solana"
              : "Avalanche",
          amount,
          value: `$${parseFloat(value).toLocaleString()}`,
          allocation: parseFloat(
            ((parseFloat(value) / 25000) * 100).toFixed(1)
          ),
          change24h: `${change > 0 ? "+" : ""}${change}%`,
        };
      });

      // Calculate total value
      const totalValue = assets.reduce(
        (sum, asset) => sum + parseFloat(asset.value.replace(/[$,]/g, "")),
        0
      );

      // Generate transactions
      const transactions = [];
      const dates = ["2023-11-22", "2023-11-20", "2023-11-18", "2023-11-15"];
      const types = ["Buy", "Sell", "Swap"];

      for (let i = 0; i < 4; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const assetIndex = Math.floor(Math.random() * assets.length);
        const asset = assets[assetIndex].symbol;
        const secondAsset = assets[(assetIndex + 1) % assets.length].symbol;

        const amount = (
          parseFloat(assets[assetIndex].amount) *
          (Math.random() * 0.2 + 0.05)
        ).toFixed(asset === "MATIC" ? 0 : 4);

        const value = (
          parseFloat(amount) * parseFloat(tokenPrices[asset].replace(/,/g, ""))
        ).toFixed(2);

        transactions.push({
          type,
          asset: type === "Swap" ? `${asset} → ${secondAsset}` : asset,
          amount,
          value: `$${parseFloat(value).toLocaleString()}`,
          date: dates[i],
          status: "Completed",
        });
      }

      // Update portfolio data while preserving the portfolios array
      setPortfolioData((prev) => ({
        totalValue: `$${totalValue.toLocaleString()}`,
        change24h: `+${(Math.random() * 5).toFixed(2)}%`,
        assets,
        transactions,
        portfolios: prev.portfolios, // Keep existing portfolios
      }));
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      toast.error("Failed to fetch portfolio data");
    } finally {
      setIsLoading(false);
    }
  };

  // Update the addPortfolio function to properly handle portfolios
  const addPortfolio = () => {
    // Reset error state
    setAddressError("");

    // Validate the address
    if (!newPortfolioAddress) {
      setAddressError("Address is required");
      return;
    }

    if (
      !newPortfolioAddress.startsWith("0x") ||
      newPortfolioAddress.length !== 42
    ) {
      setAddressError("Invalid Ethereum address format");
      return;
    }

    // Check if address is already added
    if (portfolioData.portfolios.includes(newPortfolioAddress)) {
      setAddressError("Portfolio already exists");
      return;
    }

    // Add the new portfolio
    const updatedPortfolios = [
      ...portfolioData.portfolios,
      newPortfolioAddress,
    ];

    // Update state first to ensure we have the latest data
    setPortfolioData((prev) => ({
      ...prev,
      portfolios: updatedPortfolios,
    }));

    // Then update local storage
    try {
      localStorage.setItem("portfolios", JSON.stringify(updatedPortfolios));
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }

    // Fetch portfolio data
    fetchPortfolioData(newPortfolioAddress);

    // Close the dialog and reset the form
    setAddPortfolioOpen(false);
    setNewPortfolioAddress("");

    toast.success("Portfolio added successfully");
  };

  // Update the portfolio display section to show our dummy data
  const renderPortfolioContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-[#00E99E] animate-spin mb-4" />
          <p className="text-gray-400">Loading portfolio data...</p>
        </div>
      );
    }

    if (!portfolioData.portfolios || portfolioData.portfolios.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-400 mb-4">No portfolio data available</p>
          <Button
            onClick={() => setAddPortfolioOpen(true)}
            className="bg-[#00E99E] hover:bg-[#00E99E]/80 text-black"
          >
            Add an Ethereum address to track your assets
          </Button>
        </div>
      );
    }

    return (
      <>
        <Tabs defaultValue="assets" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-black/30">
              <TabsTrigger
                value="assets"
                className="data-[state=active]:bg-[#00E99E] data-[state=active]:text-black"
              >
                Assets
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="data-[state=active]:bg-[#00E99E] data-[state=active]:text-black"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-[#00E99E] data-[state=active]:text-black"
              >
                History
              </TabsTrigger>
            </TabsList>

            <LastUpdated />
          </div>

          <TabsContent value="assets">
            {portfolioData.assets && portfolioData.assets.length > 0 ? (
              <div className="space-y-3">
                {/* Assets list with improved visuals */}
                {portfolioData.assets.map((asset, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-black/50 rounded-lg hover:bg-black/70 transition-colors cursor-pointer border border-transparent hover:border-[#333333]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0
                            ? "bg-[#00E99E]/10"
                            : index === 1
                            ? "bg-blue-500/10"
                            : index === 2
                            ? "bg-purple-500/10"
                            : "bg-yellow-500/10"
                        }`}
                      >
                        <span
                          className={`font-bold ${
                            index === 0
                              ? "text-[#00E99E]"
                              : index === 1
                              ? "text-blue-500"
                              : index === 2
                              ? "text-purple-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {asset.symbol.substring(0, 1)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-xs text-gray-400">
                          {asset.amount} {asset.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{asset.value}</div>
                      <div className="text-xs flex items-center justify-end gap-1">
                        <span className="text-gray-400">
                          {asset.allocation}%
                        </span>
                        <PriceMovement
                          value={asset.change24h}
                          isPositive={asset.change24h.startsWith("+")}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-gray-400 mb-4">
                  No assets found for this address
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="transactions">
            {/* Transactions */}
            <div className="space-y-2">
              {portfolioData.transactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "Buy"
                          ? "bg-green-500/10"
                          : tx.type === "Sell"
                          ? "bg-red-500/10"
                          : "bg-blue-500/10"
                      }`}
                    >
                      <span
                        className={
                          tx.type === "Buy"
                            ? "text-green-500"
                            : tx.type === "Sell"
                            ? "text-red-500"
                            : "text-blue-500"
                        }
                      >
                        {tx.type.substring(0, 1)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">
                        {tx.type} {tx.asset}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        {tx.date} • {tx.amount}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="text-blue-400 underline decoration-dotted">
                                0x8f3c...2e91
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View transaction on Etherscan</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{tx.value}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      {tx.status}
                      <span className="text-gray-500">Gas: 0.002 ETH</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <LineChart className="h-12 w-12 text-gray-500 opacity-50" />
              <p className="text-gray-400">
                Portfolio history will appear here
              </p>
              <Button variant="outline" size="sm" className="border-[#333333]">
                Enable History Tracking
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#222222]">
          <NetworkStatus />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#00E99E]" />
          <div className="text-sm text-gray-400">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  // If not loading and not connected, return null (redirect will happen)
  if (!isConnected) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white flex font-['IBM_Plex_Sans']">
        {/* Sidebar Navigation */}
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0A0A0A] border-r border-[#222222] z-50 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-[#222222]">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#00E99E] to-[#00C080] w-9 h-9 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,233,158,0.3)]">
                <LineChart className="h-5 w-5 text-black" />
              </div>
              <div className="font-bold text-xl tracking-tight">
                Sent<span className="text-[#00E99E]">Trade</span>
                <span className="text-gray-500 font-normal text-sm">.ai</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-[#00E99E]/20 to-transparent text-white font-medium border-l-2 border-[#00E99E]"
            >
              <Home className="h-5 w-5 text-[#00E99E]" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/strategy"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <Brain className="h-5 w-5" />
              <span>Strategy</span>
            </Link>
            <Link
              href="/dashboard/social"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Social</span>
            </Link>

            {/* Section Divider */}
            <div className="pt-4 pb-2">
              <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Analytics
              </div>
            </div>

            <Link
              href="/dashboard/portfolio"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <Wallet className="h-5 w-5" />
              <span>Portfolio</span>
            </Link>
            <Link
              href="/dashboard/markets"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Markets</span>
            </Link>

            {/* Section Divider */}
            <div className="pt-4 pb-2">
              <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Settings
              </div>
            </div>

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <Link
              href="/dashboard/help"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <HelpCircle className="h-5 w-5" />
              <span>Help & Support</span>
            </Link>
          </nav>

          {/* Market Status */}
          {/* <div className="p-4 border-t border-[#222222]">
            <div className="bg-[#111111] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-[#00E99E] rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Market Open</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs">
                  <div className="text-gray-400">BTC</div>
                  <div className="font-medium text-[#00E99E]">$48,256</div>
                </div>
                <div className="text-xs">
                  <div className="text-gray-400">ETH</div>
                  <div className="font-medium text-[#00E99E]">$3,487</div>
                </div>
                <div className="text-xs">
                  <div className="text-gray-400">BNB</div>
                  <div className="font-medium text-[#00E99E]">$608</div>
                </div>
              </div>
            </div>
          </div> */}

          {/* User Profile */}
          <div className="p-4 border-t border-[#222222]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[#111111] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00E99E]/20 to-[#00C080]/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-[#00E99E]" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium truncate">
                      {formatAddress(address)}
                    </div>
                    <div className="text-xs text-gray-500">Connected</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 bg-[#111111] border-[#222222] text-white rounded-lg shadow-xl"
              >
                <div className="px-4 py-3 border-b border-[#222222]">
                  <p className="text-sm font-medium">Connected Wallet</p>
                  <p className="text-xs text-gray-400 mt-1 break-all">
                    {address}
                  </p>
                </div>
                <div className="p-2">
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer rounded-md hover:bg-[#222222] focus:bg-[#222222]"
                    onClick={() => {
                      if (address) {
                        navigator.clipboard.writeText(address);
                        toast.success("Address copied to clipboard");
                      }
                    }}
                  >
                    <User className="h-4 w-4 text-gray-400" />
                    <span>Copy Address</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer rounded-md hover:bg-[#222222] focus:bg-[#222222]">
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                    <span>View on Explorer</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#222222]" />
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer rounded-md hover:bg-red-900/20 focus:bg-red-900/20 text-red-500"
                    onClick={handleDisconnect}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Disconnect</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">
          {/* Top Header with Search and Notifications */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                className="block w-full p-2 pl-10 text-sm bg-[#111111]/80 border border-[#333333] rounded-lg focus:ring-[#00E99E] focus:border-[#00E99E] text-white placeholder-gray-400"
                placeholder="Search tokens, strategies..."
              />
            </div>

            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg relative border-[#333333] bg-[#111111]/80 hover:bg-[#222222] hover:border-[#444444]"
                    >
                      <Bell className="h-4 w-4 text-gray-400" />
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-[#00E99E] rounded-full border-2 border-black"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>3 new notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="outline"
                size="sm"
                className="border-[#333333] bg-[#111111]/80 hover:bg-[#222222] hover:border-[#444444] rounded-lg"
              >
                <RefreshCw className="h-4 w-4 text-gray-400 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Dashboard Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-400">
              Welcome back! Here's your trading overview.
            </p>
          </div>

          {/* Main Grid Layout - Reorganized for better visual hierarchy */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - 6 columns */}
            <div className="col-span-6 space-y-6">
              {/* Portfolio Section */}
              <div className="bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-xl border border-[#222222] p-6 shadow-lg transition-all duration-300 hover:border-[#333333]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Portfolio</h2>
                    <p className="text-sm text-gray-400">
                      Current holdings and performance
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddPortfolioOpen(true)}
                      className="h-8 border-[#333333] hover:bg-[#222222] text-gray-300 transition-all duration-200"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Portfolio
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <RefreshCw className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-6 mb-6">
                  <div className="col-span-7">
                    <div className="flex items-start">
                      <div>
                        <div className="text-3xl font-bold mb-1">
                          {portfolioData.totalValue || "$0.00"}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`font-medium ${
                              parseFloat(portfolioData.change24h || "0") >= 0
                                ? "bg-[#00E99E]/20 text-[#00E99E] border-[#00E99E]/30"
                                : "bg-red-500/20 text-red-500 border-red-500/30"
                            }`}
                          >
                            <PriceMovement
                              value={portfolioData.change24h || "0.00%"}
                              isPositive={
                                parseFloat(portfolioData.change24h || "0") >= 0
                              }
                            />
                          </Badge>
                          <span className="text-xs text-gray-400">
                            24h change
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            Connected address:
                          </span>{" "}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="underline decoration-dotted">
                                  {portfolioData.portfolios &&
                                  portfolioData.portfolios.length > 0
                                    ? `${portfolioData.portfolios[0].substring(
                                        0,
                                        6
                                      )}...${portfolioData.portfolios[0].substring(
                                        38
                                      )}`
                                    : "No address"}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View on Etherscan</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-blue-500/10 text-blue-400 border-blue-500/20"
                        >
                          Ethereum
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-5">
                    {/* Portfolio allocation chart */}
                    <div className="h-28 w-full">
                      {portfolioData.assets &&
                      portfolioData.assets.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={portfolioData.assets}
                              dataKey="allocation"
                              nameKey="symbol"
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={40}
                            >
                              {portfolioData.assets.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    index === 0
                                      ? "#00E99E"
                                      : index === 1
                                      ? "#3B82F6"
                                      : index === 2
                                      ? "#8B5CF6"
                                      : "#F59E0B"
                                  }
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [`${value}%`, "Allocation"]}
                              contentStyle={{
                                background: "rgba(0,0,0,0.8)",
                                border: "1px solid #333",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-gray-500 text-sm">
                            No allocation data
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="assets" className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <TabsList className="bg-black/30">
                      <TabsTrigger
                        value="assets"
                        className="data-[state=active]:bg-[#00E99E] data-[state=active]:text-black"
                      >
                        Assets
                      </TabsTrigger>
                      <TabsTrigger
                        value="transactions"
                        className="data-[state=active]:bg-[#00E99E] data-[state=active]:text-black"
                      >
                        Transactions
                      </TabsTrigger>
                      <TabsTrigger
                        value="history"
                        className="data-[state=active]:bg-[#00E99E] data-[state=active]:text-black"
                      >
                        History
                      </TabsTrigger>
                    </TabsList>

                    <LastUpdated />
                  </div>

                  <TabsContent value="assets">
                    {portfolioData.assets && portfolioData.assets.length > 0 ? (
                      <div className="space-y-3">
                        {/* Assets list with improved visuals */}
                        {portfolioData.assets.map((asset, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-black/50 rounded-lg hover:bg-black/70 transition-colors cursor-pointer border border-transparent hover:border-[#333333]"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  index === 0
                                    ? "bg-[#00E99E]/10"
                                    : index === 1
                                    ? "bg-blue-500/10"
                                    : index === 2
                                    ? "bg-purple-500/10"
                                    : "bg-yellow-500/10"
                                }`}
                              >
                                <span
                                  className={`font-bold ${
                                    index === 0
                                      ? "text-[#00E99E]"
                                      : index === 1
                                      ? "text-blue-500"
                                      : index === 2
                                      ? "text-purple-500"
                                      : "text-yellow-500"
                                  }`}
                                >
                                  {asset.symbol.substring(0, 1)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{asset.name}</div>
                                <div className="text-xs text-gray-400">
                                  {asset.amount} {asset.symbol}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{asset.value}</div>
                              <div className="text-xs flex items-center justify-end gap-1">
                                <span className="text-gray-400">
                                  {asset.allocation}%
                                </span>
                                <PriceMovement
                                  value={asset.change24h}
                                  isPositive={asset.change24h.startsWith("+")}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-gray-400 mb-4">
                          No assets found for this address
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Other tab contents remain the same */}
                </Tabs>
              </div>

              {/* AI Performance Section */}
              <div className="bg-gradient-to-br from-[#111111] to-[#111111]/80 p-6 rounded-xl border border-[#222222]/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      AI Performance
                    </h2>
                    <p className="text-sm text-gray-400">
                      Portfolio value over time
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <LastUpdated />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold">$9,876.08</div>
                    <div className="text-[#00E99E] text-sm font-medium">
                      +1.85%
                    </div>
                  </div>
                  <div className="h-[200px] mt-4">
                    <InteractiveChart data={chartData} height={200} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-black/30 p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Win Rate</div>
                    <div className="text-xl font-bold">76%</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">
                      Avg. Return
                    </div>
                    <div className="text-xl font-bold text-[#00E99E]">
                      +1.85%
                    </div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Signals</div>
                    <div className="text-xl font-bold">16</div>
                  </div>
                </div>
              </div>

              {/* Market Sentiment Section - Moved from left column */}
              <div className="bg-gradient-to-br from-[#111111] to-[#111111]/80 p-6 rounded-xl border border-[#222222]/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      Market Sentiment
                    </h2>
                    <p className="text-sm text-gray-400">Overall market mood</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#00E99E]">76%</div>
                    <div className="text-sm text-gray-400 mt-1">Bullish</div>
                  </div>
                  <div className="h-12 w-px bg-[#222222]"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">14%</div>
                    <div className="text-sm text-gray-400 mt-1">Bearish</div>
                  </div>
                  <div className="h-12 w-px bg-[#222222]"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500">
                      10%
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Neutral</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Bullish</span>
                      <span className="text-[#00E99E]">76%</span>
                    </div>
                    <div className="w-full bg-[#222222] rounded-full h-2">
                      <div
                        className="bg-[#00E99E] h-2 rounded-full"
                        style={{ width: "76%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Bearish</span>
                      <span className="text-red-500">14%</span>
                    </div>
                    <div className="w-full bg-[#222222] rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: "14%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Neutral</span>
                      <span className="text-yellow-500">10%</span>
                    </div>
                    <div className="w-full bg-[#222222] rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - 6 columns */}
            <div className="col-span-6 space-y-6">
              {/* Enhanced Chart Section */}
              <div className="bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-xl border border-[#222222] p-6 shadow-lg transition-all duration-300 hover:border-[#333333]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      Portfolio & Sentiment
                    </h2>
                    <p className="text-sm text-gray-400">
                      Real-time market analysis
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {/* Time period selector with improved styling */}
                    <div className="bg-black/30 rounded-lg p-1 flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs bg-[#00E99E]/20 text-[#00E99E] hover:bg-[#00E99E]/30 rounded-md"
                      >
                        1W
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs text-gray-400 hover:bg-[#222222] rounded-md"
                      >
                        1M
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs text-gray-400 hover:bg-[#222222] rounded-md"
                      >
                        3M
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs text-gray-400 hover:bg-[#222222] rounded-md"
                      >
                        1Y
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Chart with annotations */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold">$9,876.08</div>
                      <div className="text-[#00E99E] text-sm font-medium flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5" />
                        +1.85%
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="bg-[#00E99E]/10 text-[#00E99E] border-[#00E99E]/30"
                      >
                        Bullish
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 text-blue-400 border-blue-500/30"
                      >
                        Low Volatility
                      </Badge>
                    </div>
                  </div>

                  <div className="h-[300px] relative">
                    <InteractiveChart data={chartData} />

                    {/* Add chart annotations */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs bg-black/70 p-2 rounded-md border border-[#333333]">
                        <div className="w-3 h-3 rounded-full bg-[#00E99E]"></div>
                        <span>Portfolio Value</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs bg-black/70 p-2 rounded-md border border-[#333333]">
                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                        <span>Market Sentiment</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key metrics below chart */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="bg-black/30 p-3 rounded-lg border border-[#222222]">
                    <div className="text-xs text-gray-400 mb-1">Volume</div>
                    <div className="text-lg font-bold">$24.8M</div>
                    <div className="text-xs text-[#00E99E]">+12.4%</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg border border-[#222222]">
                    <div className="text-xs text-gray-400 mb-1">Liquidity</div>
                    <div className="text-lg font-bold">$142.3M</div>
                    <div className="text-xs text-[#00E99E]">+3.8%</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg border border-[#222222]">
                    <div className="text-xs text-gray-400 mb-1">Volatility</div>
                    <div className="text-lg font-bold">18.2%</div>
                    <div className="text-xs text-red-400">+2.1%</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg border border-[#222222]">
                    <div className="text-xs text-gray-400 mb-1">Sentiment</div>
                    <div className="text-lg font-bold">76/100</div>
                    <div className="text-xs text-[#00E99E]">Bullish</div>
                  </div>
                </div>
              </div>

              {/* Latest AI Insights - Enhanced */}
              <div className="bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-xl border border-[#222222] p-6 shadow-lg transition-all duration-300 hover:border-[#333333]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">AI Insights</h2>
                    <p className="text-sm text-gray-400">
                      Latest market analysis
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs text-[#00E99E] border-[#00E99E]/30 hover:bg-[#00E99E]/10"
                  >
                    View All
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </div>

                {/* Enhanced insight cards with better visual hierarchy */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-black/50 to-[#111111]/50 p-4 rounded-lg hover:bg-black/70 transition-colors border border-[#222222] hover:border-[#333333]">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#00E99E]/20 p-2 rounded-full">
                        <TrendingUp className="h-4 w-4 text-[#00E99E]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-sm mb-1">
                            Bitcoin breakout imminent
                          </div>
                          <Badge className="bg-[#00E99E]/10 text-[#00E99E] border-[#00E99E]/30">
                            2m ago
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">
                          Multiple technical indicators suggest a potential
                          breakout above $48,000 resistance level
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className="text-xs bg-transparent border-[#333333] text-gray-400"
                          >
                            BTC
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs bg-transparent border-[#333333] text-gray-400"
                          >
                            Technical
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs bg-transparent border-[#333333] text-gray-400"
                          >
                            Breakout
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-black/50 to-[#111111]/50 p-4 rounded-lg hover:bg-black/70 transition-colors border border-[#222222] hover:border-[#333333]">
                    <div className="flex items-start gap-3">
                      <div className="bg-yellow-500/20 p-2 rounded-full">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-sm mb-1">
                            Ethereum gas spike detected
                          </div>
                          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                            15m ago
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">
                          Unusual activity on DeFi protocols causing elevated
                          gas fees. Average transaction cost up 25%
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className="text-xs bg-transparent border-[#333333] text-gray-400"
                          >
                            ETH
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs bg-transparent border-[#333333] text-gray-400"
                          >
                            Gas
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs bg-transparent border-[#333333] text-gray-400"
                          >
                            DeFi
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-black/50 to-[#111111]/50 p-4 rounded-lg hover:bg-black/70 transition-colors border border-[#222222] hover:border-[#333333]">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#00E99E]/20 p-2 rounded-full">
                        <Zap className="h-4 w-4 text-[#00E99E]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-sm mb-1">
                            New trading opportunity
                          </div>
                          <Badge className="bg-[#00E99E]/10 text-[#00E99E] border-[#00E99E]/30">
                            28m ago
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">
                          AI detected potential arbitrage opportunity between
                          Binance and Coinbase for BTC-USDT pair
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className="text-xs bg-transparent border-[#333333] text-gray-400"
                          >
                            Arbitrage
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs bg-transparent border-[#333333] text-gray-400"
                          >
                            BTC-USDT
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Tokens - Moved down */}
              <div className="bg-gradient-to-br from-[#111111] to-[#111111]/80 p-6 rounded-xl border border-[#222222]/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Top Tokens</h2>
                    <p className="text-sm text-gray-400">Ethereum Ecosystem</p>
                  </div>
                  {isLoading && (
                    <div className="animate-pulse flex space-x-2">
                      <div className="h-2 w-2 bg-[#00E99E] rounded-full"></div>
                      <div className="h-2 w-2 bg-[#00E99E] rounded-full"></div>
                      <div className="h-2 w-2 bg-[#00E99E] rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Token cards with real data - Optimized layout */}
                <div className="space-y-2.5">
                  {tokens.map((token) => {
                    const sentimentScore = getSentimentScore(token);
                    const isHighSentiment = sentimentScore > 85;

                    return (
                      <div
                        key={token.id}
                        className={`${
                          isHighSentiment
                            ? "bg-gradient-to-r from-[#00E99E]/10 to-black/40 border-[#00E99E]/20"
                            : "bg-gradient-to-r from-[#111111] to-black/40 border-[#222222]/50"
                        } p-3 rounded-lg border transition-all hover:border-[#00E99E]/30`}
                      >
                        <div className="flex items-center gap-2">
                          {/* Token icon */}
                          <div className="flex-shrink-0">
                            <img
                              src={token.image}
                              width={32}
                              height={32}
                              alt={token.symbol.toUpperCase()}
                              className="rounded-full"
                            />
                          </div>

                          {/* Token info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="truncate">
                                <div className="font-medium text-sm truncate">
                                  {token.name}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {token.symbol.toUpperCase()}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="font-semibold text-sm">
                                  {formatCurrency(token.current_price)}
                                </div>
                                <div
                                  className={`text-xs flex items-center justify-end gap-0.5 ${
                                    token.price_change_percentage_24h >= 0
                                      ? "text-[#00E99E]"
                                      : "text-red-500"
                                  }`}
                                >
                                  {token.price_change_percentage_24h >= 0
                                    ? "↑"
                                    : "↓"}
                                  {Math.abs(
                                    token.price_change_percentage_24h
                                  ).toFixed(2)}
                                  %
                                </div>
                              </div>
                            </div>

                            {/* Bottom row with rank and sentiment */}
                            <div className="flex items-center justify-between mt-1">
                              <div className="text-xs text-gray-500">
                                Rank #{token.market_cap_rank}
                              </div>
                              <div
                                className={`text-xs font-medium ${
                                  sentimentScore > 70
                                    ? "text-[#00E99E]"
                                    : "text-gray-400"
                                }`}
                              >
                                Sentiment: {sentimentScore}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Loading skeletons - optimized */}
                  {isLoading &&
                    tokens.length === 0 &&
                    Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-[#111111] to-black/40 p-3 rounded-lg border border-[#222222]/50 animate-pulse"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1 flex-1">
                                  <div className="h-3 bg-gray-800 rounded w-20"></div>
                                  <div className="h-2 bg-gray-800 rounded w-12"></div>
                                </div>
                                <div className="text-right space-y-1 flex-shrink-0 ml-4">
                                  <div className="h-3 bg-gray-800 rounded w-16"></div>
                                  <div className="h-2 bg-gray-800 rounded w-12"></div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <div className="h-2 bg-gray-800 rounded w-16"></div>
                                <div className="h-2 bg-gray-800 rounded w-20"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>

              {/* Signal Breakdown - Moved from right column */}
              <div className="bg-gradient-to-br from-[#111111] to-[#111111]/80 p-6 rounded-xl border border-[#222222]/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Signals</h2>
                    <p className="text-sm text-gray-400">Market indicators</p>
                  </div>
                </div>
                {/* Enhanced signal list with better visual hierarchy */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#00E99E]/20 w-8 h-8 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-[#00E99E]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Buy Signal</div>
                        <div className="text-xs text-gray-400">
                          8 active signals
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-[#00E99E]">
                        +12.3%
                      </div>
                      <div className="text-xs text-gray-400">Avg. Return</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-500/20 w-8 h-8 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Sell Signal</div>
                        <div className="text-xs text-gray-400">
                          3 active signals
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-500">
                        -4.2%
                      </div>
                      <div className="text-xs text-gray-400">Avg. Return</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-500/20 w-8 h-8 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Neutral</div>
                        <div className="text-xs text-gray-400">5 tokens</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-yellow-500">
                        0.8%
                      </div>
                      <div className="text-xs text-gray-400">Avg. Return</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Portfolio Dialog */}
      <Dialog open={addPortfolioOpen} onOpenChange={setAddPortfolioOpen}>
        <DialogContent className="bg-[#111111] border border-[#222222] text-white">
          <DialogHeader>
            <DialogTitle>Add Portfolio</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter an Ethereum address to track its assets and transactions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="address">Ethereum Address</Label>
              <Input
                id="address"
                placeholder="0x..."
                value={newPortfolioAddress}
                onChange={(e) => setNewPortfolioAddress(e.target.value)}
                className="bg-[#191919] border-[#333333] focus:border-[#00E99E] focus:ring-[#00E99E]/10"
              />
              {addressError && (
                <p className="text-red-500 text-xs mt-1">{addressError}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddPortfolioOpen(false);
                setNewPortfolioAddress("");
                setAddressError("");
              }}
              className="border-[#333333] hover:bg-[#222222] text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={addPortfolio}
              className="bg-[#00E99E] hover:bg-[#00E99E]/80 text-black"
            >
              Add Portfolio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogTrigger asChild>
          <Button>Create Strategy</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Strategy</DialogTitle>
            <DialogDescription>
              Configure your new trading strategy based on sentiment analysis.
            </DialogDescription>
          </DialogHeader>

          {/* Strategy creation form */}
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name">Strategy Name</label>
              <input
                id="name"
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter strategy name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                className="w-full p-2 border rounded"
                placeholder="Describe your strategy"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
