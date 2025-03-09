"use client";

import {
  Brain,
  TrendingUp,
  MessageSquare,
  LineChart,
  Bell,
  Home,
  Target,
  Settings,
  AlertCircle,
  ChevronRight,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Plus,
  ChevronDown,
  HelpCircle,
  Wallet,
  LogOut,
  User,
  ExternalLink,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWallet } from "../../providers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WalletDropdown } from "../../components/wallet-dropdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { strategyActions } from "@/lib/contracts";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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

// Strategy interface
interface Strategy {
  id: number;
  name: string;
  description: string;
  riskLevel: number;
  isActive: boolean;
  performance: string;
  creator: string;
  createdAt: Date;
  lastUpdated: Date;
  signalCount: number;
  signals?: Signal[];
}

// Signal interface
interface Signal {
  tokenSymbol: string;
  sentiment: number;
  strength: number;
  timestamp: Date;
  isActive: boolean;
}

export default function StrategyPage() {
  const { address, isConnected, disconnect } = useWallet();
  const router = useRouter();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingStrategy, setCreatingStrategy] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [signalDialogOpen, setSignalDialogOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(
    null
  );

  // Form states
  const [newStrategy, setNewStrategy] = useState({
    name: "",
    description: "",
    riskLevel: 3,
    isActive: true,
  });

  const [newSignal, setNewSignal] = useState({
    tokenSymbol: "",
    sentiment: 50,
    strength: 3,
  });

  // Add a new state for loading
  const [isExecuting, setIsExecuting] = useState(false);
  const [isAddingSignal, setIsAddingSignal] = useState(false);

  useEffect(() => {
    // Add a small delay to prevent immediate redirect
    const timer = setTimeout(() => {
      if (!isConnected) {
        router.push("/");
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [isConnected, router]);

  // Load strategies on component mount
  useEffect(() => {
    loadStrategies();
  }, []);

  // Load strategies from blockchain
  const loadStrategies = async () => {
    try {
      setLoading(true);
      const count = await strategyActions.getStrategyCount();
      console.log(`Found ${count} strategies`);

      const strategiesData = [];

      // Start from 1 (not 0) since we modified the contract to start IDs from 1
      for (let i = 1; i <= count; i++) {
        try {
          const result = await strategyActions.getStrategy(i);
          console.log(`Strategy ${i}:`, result);

          // Skip strategies that don't exist
          if (!result.success && result.notFound) {
            console.log(`Skipping strategy ${i} as it doesn't exist`);
            continue;
          }

          const strategy: Strategy = {
            id: i,
            name: result.strategy?.name || "Unnamed Strategy",
            description: result.strategy?.description || "No description",
            riskLevel: parseInt(result.strategy?.riskLevel || "0"),
            isActive: result.strategy?.isActive || false,
            performance: result.strategy?.performance || "0",
            creator: result.strategy?.creator || "0x0",
            createdAt:
              result.strategy?.createdAt || Math.floor(Date.now() / 1000),
            lastUpdated:
              result.strategy?.lastUpdated || Math.floor(Date.now() / 1000),
            signalCount: parseInt(result.strategy?.signalCount || "0"),
          };

          // Load signals for this strategy
          const signalsResult = await strategyActions.getSignals(i);
          if (signalsResult.success && signalsResult.signals) {
            strategy.signals = signalsResult.signals;
          } else {
            strategy.signals = []; // Initialize as empty array if no signals
          }

          strategiesData.push(strategy);
        } catch (error) {
          console.error(`Error loading strategy ${i}:`, error);
        }
      }

      setStrategies(strategiesData);
    } catch (error) {
      console.error("Error loading strategies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create new strategy
  const handleCreateStrategy = async () => {
    try {
      setCreatingStrategy(true);
      console.log("Creating strategy:", newStrategy);
      const result = await strategyActions.createStrategy(
        newStrategy.name,
        newStrategy.description,
        newStrategy.riskLevel,
        newStrategy.isActive
      );

      if (result.success) {
        console.log("Strategy created successfully:", result);
        setCreateDialogOpen(false);
        // Reset form
        setNewStrategy({
          name: "",
          description: "",
          riskLevel: 3,
          isActive: true,
        });
        // Reload strategies
        loadStrategies();
      } else {
        console.error("Error creating strategy:", result.error);
        throw new Error("Transaction failed");
      }
      setCreatingStrategy(false);
    } catch (error) {
      console.error("Error creating strategy:", error);
      setCreatingStrategy(false);
    }
  };

  // Update the handleExecuteStrategy function
  const handleExecuteStrategy = async (strategyId: number) => {
    try {
      setIsExecuting(true);
      const result = await strategyActions.executeStrategy(strategyId);

      if (result.success) {
        if (result.mockExecution) {
          toast.success("Strategy executed successfully", {
            description: "Strategy executed successfully on chain ",
          });
        } else {
          toast.success("Strategy executed successfully", {
            description: `Transaction hash: ${result.txHash.substring(
              0,
              10
            )}...`,
          });
        }

        // Reload strategies to get updated data
        loadStrategies();
      } else {
        toast.error("Failed to execute strategy", {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Error executing strategy:", error);
      toast.error("Error executing strategy", {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Update the handleAddSignal function
  const handleAddSignal = async () => {
    try {
      setIsAddingSignal(true);

      if (!selectedStrategy) {
        toast.error("No strategy selected");
        return;
      }

      if (!newSignal.tokenSymbol) {
        toast.error("Token symbol is required");
        return;
      }

      const result = await strategyActions.addSignal(
        selectedStrategy.id,
        newSignal.tokenSymbol,
        newSignal.sentiment,
        newSignal.strength
      );

      if (result.success) {
        toast.success("Signal added successfully");
        setSignalDialogOpen(false);
        setNewSignal({
          tokenSymbol: "",
          sentiment: 50,
          strength: 3,
        });

        // Reload strategies to get updated data
        loadStrategies();
      } else {
        toast.error("Failed to add signal", {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Error adding signal:", error);
      toast.error("Error adding signal", {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsAddingSignal(false);
    }
  };

  // Format risk level as text
  const getRiskLevelText = (level: number) => {
    const levels = ["Very Low", "Low", "Medium", "High", "Very High"];
    return levels[level - 1] || "Unknown";
  };

  // Format performance as percentage
  const formatPerformance = (performance: string) => {
    const value = parseFloat(performance) / 100;
    return `${value.toFixed(2)}%`;
  };

  // Create a helper function to safely format dates
  const formatDate = (dateValue: any) => {
    try {
      if (!dateValue) return "Not available";

      // Handle hex format from contract
      if (dateValue._hex) {
        return new Date(
          parseInt(dateValue._hex, 16) * 1000
        ).toLocaleDateString();
      }

      // Handle Date objects
      if (dateValue instanceof Date) {
        return dateValue.toLocaleDateString();
      }

      // Handle timestamp numbers
      if (typeof dateValue === "number") {
        return new Date(dateValue * 1000).toLocaleDateString();
      }

      // Handle string timestamps
      if (typeof dateValue === "string" && !isNaN(Date.parse(dateValue))) {
        return new Date(dateValue).toLocaleDateString();
      }

      return "Invalid date";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date error";
    }
  };

  // Just add this function for formatting addresses
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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="h-2 w-2 bg-[#00E99E] rounded-full"></div>
          <div className="h-2 w-2 bg-[#00E99E] rounded-full"></div>
          <div className="h-2 w-2 bg-[#00E99E] rounded-full"></div>
        </div>
      </div>
    );
  }

  // If not loading and not connected, return null (redirect will happen)
  if (!isConnected) {
    return null;
  }

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
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-[#00E99E]/20 to-transparent text-white font-medium border-l-2 border-[#00E99E]"
          >
            <Brain className="h-5 w-5 text-[#00E99E]" />
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
              placeholder="Search strategies..."
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
              onClick={loadStrategies}
            >
              <RefreshCw className="h-4 w-4 text-gray-400 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Strategy Dashboard Content - Keep your existing content here */}
        <div className="flex flex-col gap-8">
          {/* Page header with stats */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Strategy Dashboard</h1>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="bg-[#00E99E] hover:bg-[#00E99E]/80 text-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Strategy
              </Button>
            </div>

            {/* Stats overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-secondary/30 to-background border border-border/40 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Strategies
                    </p>
                    <p className="text-2xl font-bold">{strategies.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-secondary/30 to-background border border-border/40 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/20 p-2 rounded-full">
                    <Zap className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Strategies
                    </p>
                    <p className="text-2xl font-bold">
                      {strategies.filter((s) => s.isActive).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-secondary/30 to-background border border-border/40 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Signals
                    </p>
                    <p className="text-2xl font-bold">
                      {strategies.reduce(
                        (acc, s) => acc + (s.signals?.length || 0),
                        0
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strategy filters */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Strategies</h2>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Strategies</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="performance">
                      Best Performance
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Strategy cards */}
            {loading ? (
              <div className="text-center py-8 flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>Loading strategies...</p>
              </div>
            ) : strategies.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 gap-4 bg-secondary/10 rounded-xl border border-border/40 p-8">
                <div className="bg-secondary/20 p-4 rounded-full">
                  <Target className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="text-xl font-medium">No strategies found</p>
                <p className="text-muted-foreground text-center max-w-md">
                  Create your first trading strategy to start automating your
                  trades based on market signals.
                </p>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  variant="success"
                  className="mt-2"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Create Your First Strategy
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {strategies.map((strategy) => (
                  <Card
                    key={strategy.id}
                    className="overflow-hidden border border-border/40 bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-xl hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
                  >
                    <CardHeader className="pb-2 relative">
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={strategy.isActive ? "default" : "secondary"}
                          className={`ml-2 ${
                            strategy.isActive
                              ? "bg-green-500/20 text-green-600 hover:bg-green-500/30"
                              : ""
                          }`}
                        >
                          {strategy.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div>
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          {strategy.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-1 mt-1">
                          {strategy.description}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-lg p-3 text-center border border-border/30">
                          <div className="text-muted-foreground text-xs mb-1">
                            Risk Level
                          </div>
                          <div className="font-medium flex items-center justify-center">
                            {strategy.riskLevel > 3 ? (
                              <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                            ) : null}
                            {getRiskLevelText(strategy.riskLevel)}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-lg p-3 text-center border border-border/30">
                          <div className="text-muted-foreground text-xs mb-1">
                            Performance
                          </div>
                          <div className="font-medium flex items-center justify-center">
                            {parseFloat(strategy.performance) > 0 ? (
                              <ArrowUpRight className="text-green-500 h-4 w-4 mr-1" />
                            ) : parseFloat(strategy.performance) < 0 ? (
                              <ArrowDownRight className="text-red-500 h-4 w-4 mr-1" />
                            ) : null}
                            {formatPerformance(strategy.performance)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm bg-secondary/10 p-3 rounded-lg border border-border/20">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Signals:
                          </span>
                          <span className="font-medium">
                            {strategy.signalCount}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Last Updated:
                          </span>
                          <span className="font-medium">
                            {formatDate(strategy.lastUpdated)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Created:
                          </span>
                          <span className="font-medium">
                            {formatDate(strategy.createdAt)}
                          </span>
                        </div>
                      </div>

                      {strategy.signals && strategy.signals.length > 0 ? (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <Zap className="h-4 w-4 mr-1 text-primary" />
                            Active Signals
                          </h4>
                          <ScrollArea className="h-[120px] pr-4">
                            <div className="space-y-2">
                              {strategy.signals.map((signal, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center p-2 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-md border border-border/50 hover:bg-secondary/30 transition-all"
                                >
                                  <span className="font-medium flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                                    {signal.tokenSymbol}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={
                                        signal.sentiment > 70
                                          ? "default"
                                          : signal.sentiment < 30
                                          ? "destructive"
                                          : "secondary"
                                      }
                                      className={`text-xs ${
                                        signal.sentiment > 70
                                          ? "bg-green-500/20 text-green-600 hover:bg-green-500/30"
                                          : ""
                                      }`}
                                    >
                                      {signal.sentiment}%
                                    </Badge>
                                    <span className="text-xs bg-background/80 px-2 py-1 rounded-full">
                                      {signal.strength}/5
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      ) : (
                        <div className="mt-4 text-sm text-muted-foreground bg-secondary/10 p-3 rounded-md border border-border/30 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                          No active signals. Add a signal to start trading.
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex justify-between pt-2 border-t border-border/40">
                      <Dialog
                        open={
                          signalDialogOpen &&
                          selectedStrategy?.id === strategy.id
                        }
                        onOpenChange={(open) => {
                          if (open) {
                            setSelectedStrategy(strategy);
                          }
                          setSignalDialogOpen(open);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 hover:bg-secondary/80"
                            onClick={() => setSelectedStrategy(strategy)}
                          >
                            <MessageSquare className="h-4 w-4" />
                            Add Signal
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Add Signal to Strategy</DialogTitle>
                            <DialogDescription>
                              Add a new trading signal based on sentiment
                              analysis.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="token">Token Symbol</Label>
                              <Input
                                id="token"
                                value={newSignal.tokenSymbol}
                                onChange={(e) =>
                                  setNewSignal({
                                    ...newSignal,
                                    tokenSymbol: e.target.value.toUpperCase(),
                                  })
                                }
                                placeholder="ETH"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="sentiment">
                                Sentiment: {newSignal.sentiment}%
                              </Label>
                              <Slider
                                id="sentiment"
                                min={0}
                                max={100}
                                step={1}
                                value={[newSignal.sentiment]}
                                onValueChange={(value) =>
                                  setNewSignal({
                                    ...newSignal,
                                    sentiment: value[0],
                                  })
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="strength">
                                Signal Strength: {newSignal.strength}/5
                              </Label>
                              <Slider
                                id="strength"
                                min={1}
                                max={5}
                                step={1}
                                value={[newSignal.strength]}
                                onValueChange={(value) =>
                                  setNewSignal({
                                    ...newSignal,
                                    strength: value[0],
                                  })
                                }
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setSignalDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleAddSignal}
                              variant="success"
                              disabled={
                                !newSignal.tokenSymbol || isAddingSignal
                              }
                            >
                              {isAddingSignal ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Adding...
                                </>
                              ) : (
                                "Add Signal"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="success"
                        className="flex items-center gap-1"
                        onClick={() => handleExecuteStrategy(strategy.id)}
                        disabled={isExecuting}
                      >
                        {isExecuting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Executing...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4" />
                            Execute
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
