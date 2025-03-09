"use client";

import {
  Brain,
  MessageSquare,
  LineChart,
  Bell,
  Home,
  TrendingUp,
  Users,
  Twitter,
  Globe,
  BarChart2,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  RefreshCcw,
  RefreshCw,
  ChevronDown,
  HelpCircle,
  Wallet,
  LogOut,
  User,
  Loader2,
  ExternalLink,
  Settings,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { useWallet } from "@/hooks/useWallet";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWallet } from "@/app/providers";

// Sample social sentiment data
const trendingTopics = [
  {
    id: 1,
    topic: "Ethereum Layer 2",
    sentiment: 85,
    mentions: 1234,
    change: 23,
    sources: ["Twitter", "Reddit", "Discord"],
  },
  {
    id: 2,
    topic: "DeFi Protocols",
    sentiment: 72,
    mentions: 856,
    change: -5,
    sources: ["Twitter", "Telegram"],
  },
  {
    id: 3,
    topic: "NFT Market",
    sentiment: 62,
    mentions: 654,
    change: 12,
    sources: ["Twitter", "Discord"],
  },
];

const recentDiscussions = [
  {
    id: 1,
    title: "New DEX launch on Sonic",
    sentiment: "positive",
    timestamp: "5m ago",
    engagement: 234,
    platform: "Twitter",
  },
  {
    id: 2,
    title: "Market analysis: Bull run incoming?",
    sentiment: "neutral",
    timestamp: "15m ago",
    engagement: 156,
    platform: "Reddit",
  },
  {
    id: 3,
    title: "Sonic ecosystem growth",
    sentiment: "positive",
    timestamp: "1h ago",
    engagement: 89,
    platform: "Discord",
  },
];

interface SentimentData {
  id: string;
  platform: string;
  text: string;
  timestamp: string;
  sentiment: number;
  metrics?: {
    like_count: number;
    retweet_count: number;
  };
}

interface TwitterSentimentData {
  tweets: SentimentData[];
  overall_sentiment: number;
}

interface Topic {
  id: string;
  name: string;
  keywords: string[];
  tweets: SentimentData[];
  sentiment: number;
  mentions: number;
  change: number;
}

export default function SocialPage() {
  const { address, isConnected, disconnect } = useWallet();
  const router = useRouter();
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [twitterData, setTwitterData] = useState<TwitterSentimentData | null>(
    null
  );
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: "layer2",
      name: "Ethereum Layer 2",
      keywords: ["optimism", "arbitrum", "zksync", "polygon", "L2"],
      tweets: [],
      sentiment: 0,
      mentions: 0,
      change: 0,
    },
    {
      id: "defi",
      name: "DeFi Protocols",
      keywords: ["defi", "yield", "lending", "swap", "liquidity"],
      tweets: [],
      sentiment: 0,
      mentions: 0,
      change: 0,
    },
    {
      id: "nft",
      name: "NFT Market",
      keywords: ["nft", "opensea", "blur", "collection"],
      tweets: [],
      sentiment: 0,
      mentions: 0,
      change: 0,
    },
  ]);

  useEffect(() => {
    const processTweets = (tweets: any[]) => {
      const updatedTopics = topics.map((topic) => {
        const relevantTweets = tweets.filter((tweet) =>
          topic.keywords.some((keyword) =>
            tweet.text.toLowerCase().includes(keyword.toLowerCase())
          )
        );

        const topicSentiment =
          relevantTweets.length > 0
            ? relevantTweets.reduce((acc, tweet) => acc + tweet.sentiment, 0) /
              relevantTweets.length
            : 0;

        return {
          ...topic,
          tweets: relevantTweets,
          sentiment: Math.round(topicSentiment),
          mentions: relevantTweets.length,
          // Calculate change based on sentiment difference
          change: Math.round((topicSentiment - 50) * 2),
        };
      });

      setTopics(updatedTopics);
    };

    const fetchTwitterData = async () => {
      try {
        const response = await fetch("/api/sentiment/twitter");
        const data = await response.json();
        if (data.tweets) {
          processTweets(data.tweets);
          setTwitterData(data);
        }
      } catch (error) {
        console.error("Error fetching Twitter data:", error);
      }
    };

    fetchTwitterData();
    const interval = setInterval(fetchTwitterData, 60000); // Every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isConnected) {
        router.push("/");
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [isConnected, router]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#00E99E]" />
          <div className="text-sm text-gray-400">Loading social data...</div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return null;
  }

  const renderTrendingTopics = () => (
    <div className="space-y-4">
      {topics.map((topic) => (
        <div
          key={topic.id}
          className="bg-gradient-to-r from-[#111111] to-black/40 border border-[#222222]/50 rounded-xl p-6 hover:border-[#00E99E]/30 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">{topic.name}</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Twitter className="h-3 w-3" />
                  Twitter
                </div>
              </div>
            </div>
            <div
              className={`flex items-center gap-1 ${
                topic.change >= 0 ? "text-[#00E99E]" : "text-red-500"
              }`}
            >
              {topic.change >= 0 ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span className="text-sm">{Math.abs(topic.change)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-black/40 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Sentiment Score</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#222222] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00E99E]"
                    style={{ width: `${topic.sentiment}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{topic.sentiment}%</span>
              </div>
            </div>

            <div className="bg-black/40 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Mentions</div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">{topic.mentions}</span>
              </div>
            </div>

            <div className="bg-black/40 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Latest Tweet</div>
              <div className="text-sm truncate">
                {topic.tweets[0]?.text.slice(0, 30)}...
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRecentDiscussions = () => {
    if (!twitterData?.tweets) return null;

    return (
      <div className="space-y-3">
        {twitterData.tweets.slice(0, 5).map((tweet) => (
          <div
            key={tweet.id}
            className="p-3 bg-black/40 rounded-lg hover:bg-black/60 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-1">{tweet.text}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Twitter className="h-3 w-3" />
                  <span>
                    {new Date(tweet.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs ${
                  tweet.sentiment >= 70
                    ? "bg-[#00E99E]/20 text-[#00E99E]"
                    : tweet.sentiment <= 30
                    ? "bg-red-500/20 text-red-500"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {tweet.sentiment}%
              </div>
            </div>
            {tweet.metrics && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Users className="h-3 w-3" />
                <span>
                  {tweet.metrics.like_count + tweet.metrics.retweet_count}{" "}
                  engagements
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
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
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <Home className="h-5 w-5" />
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
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-[#00E99E]/20 to-transparent text-white font-medium border-l-2 border-[#00E99E]"
          >
            <MessageSquare className="h-5 w-5 text-[#00E99E]" />
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
            <BarChart2 className="h-5 w-5" />
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
        <div className="p-4 border-t border-[#222222]">
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
        </div>

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
              placeholder="Search social discussions..."
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
              onClick={() => {
                toast.success("Refreshing social data...");
                // Add refresh logic here
              }}
            >
              <RefreshCw className="h-4 w-4 text-gray-400 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Dashboard Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Social Sentiment</h1>
          <p className="text-gray-400">
            Real-time market sentiment analysis from social platforms
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left column - Trending Topics */}
          <div className="col-span-8">{renderTrendingTopics()}</div>

          {/* Right column - Recent Discussions & Stats */}
          <div className="col-span-4 space-y-6">
            {/* Recent Discussions */}
            <div className="bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-xl border border-[#222222] p-6 shadow-lg transition-all duration-300 hover:border-[#333333]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Discussions</h2>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <RefreshCcw className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
              {renderRecentDiscussions()}
            </div>

            {/* Market Sentiment Overview */}
            <div className="bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-xl border border-[#222222] p-6 shadow-lg transition-all duration-300 hover:border-[#333333]">
              <h2 className="text-lg font-semibold mb-4">Market Sentiment</h2>
              <div className="space-y-4">
                <div className="bg-black/40 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">
                      Overall Sentiment
                    </span>
                    <span className="text-sm font-medium text-[#00E99E]">
                      Bullish
                    </span>
                  </div>
                  <div className="h-2 bg-[#222222] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00E99E]"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/40 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">24h Volume</div>
                    <div className="text-sm font-medium">↑ 12.5%</div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">
                      Social Activity
                    </div>
                    <div className="text-sm font-medium">↑ 8.3%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
