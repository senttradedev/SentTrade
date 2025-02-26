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
  ArrowRight,
  CheckCircle,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useWallet } from "./providers";

export default function LandingPage() {
  const { connect, isConnected, isConnecting } = useWallet();
  const router = useRouter();

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, router]);

  const handleConnect = async () => {
    await connect();
  };

  return (
    <div className="min-h-screen bg-black text-white font-['IBM_Plex_Sans']">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00E99E]/10 via-black to-black pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-[#222222]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#00E99E] w-9 h-9 rounded-lg flex items-center justify-center">
              <LineChart className="h-5 w-5 text-black" />
            </div>
            <div className="font-bold text-xl tracking-tight">
              Sent<span className="text-[#00E99E]">Trade</span>
              <span className="text-gray-500 font-normal text-sm">.ai</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link
                href="#features"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#about"
                className="text-gray-400 hover:text-white transition-colors"
              >
                About
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-[#00E99E] text-black hover:bg-[#00E99E]/90 flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="bg-[#00E99E]/10 text-[#00E99E] px-4 py-2 rounded-full text-sm font-medium mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00E99E] rounded-full animate-pulse" />
              Built on Sonic & DaBridge
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 max-w-4xl">
              AI-Powered DeFi Trading with{" "}
              <span className="text-[#00E99E]">Social Sentiment</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl">
              Leverage the power of AI to analyze social sentiment and execute
              optimized trading strategies on Sonic's DeFi protocols with
              lightning-fast speed.
            </p>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-[#00E99E] text-black hover:bg-[#00E99E]/90 h-12 px-8 rounded-full flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-12 px-8 rounded-full border-[#222222] text-gray-400 hover:text-white"
              >
                Watch Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#00E99E]" />
                10,000 TPS Speed
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#00E99E]" />
                Sub-second Finality
              </div>
            </div>
          </div>

          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20">
            <div className="bg-[#111111]/50 backdrop-blur-sm border border-[#222222] p-6 rounded-xl">
              <div className="text-3xl font-bold text-[#00E99E]">10K</div>
              <div className="text-sm text-gray-400 mt-1">
                Transactions Per Second
              </div>
            </div>
            <div className="bg-[#111111]/50 backdrop-blur-sm border border-[#222222] p-6 rounded-xl">
              <div className="text-3xl font-bold text-[#00E99E]">0.5s</div>
              <div className="text-sm text-gray-400 mt-1">
                Transaction Finality
              </div>
            </div>
            <div className="bg-[#111111]/50 backdrop-blur-sm border border-[#222222] p-6 rounded-xl">
              <div className="text-3xl font-bold text-[#00E99E]">95%</div>
              <div className="text-sm text-gray-400 mt-1">
                Sentiment Accuracy
              </div>
            </div>
            <div className="bg-[#111111]/50 backdrop-blur-sm border border-[#222222] p-6 rounded-xl">
              <div className="text-3xl font-bold text-[#00E99E]">24/7</div>
              <div className="text-sm text-gray-400 mt-1">
                Market Monitoring
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section
        id="features"
        className="py-20 px-6 border-t border-[#222222] relative"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powered by Advanced DeFi Technology
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform combines Sonic's high-performance infrastructure with
              advanced AI to deliver lightning-fast DeFi trading strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#111111] to-[#111111]/80 p-8 rounded-xl border border-[#222222] hover:border-[#00E99E]/50 transition-colors">
              <div className="bg-[#00E99E]/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-[#00E99E]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-400 mb-4">
                Real-time sentiment analysis of social media data to identify
                profitable trading opportunities.
              </p>
              <ul className="space-y-2">
                {[
                  "Natural Language Processing",
                  "Sentiment Classification",
                  "Performance Learning",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-gray-400"
                  >
                    <CheckCircle className="h-4 w-4 text-[#00E99E]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#111111] to-[#111111]/80 p-8 rounded-xl border border-[#222222] hover:border-[#00E99E]/50 transition-colors">
              <div className="bg-[#00E99E]/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-[#00E99E]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sonic Integration</h3>
              <p className="text-gray-400 mb-4">
                Lightning-fast trade execution on Sonic's high-performance DeFi
                protocols.
              </p>
              <ul className="space-y-2">
                {[
                  "10,000 TPS Speed",
                  "Sub-second Finality",
                  "Cross-chain Bridge",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-gray-400"
                  >
                    <CheckCircle className="h-4 w-4 text-[#00E99E]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#111111] to-[#111111]/80 p-8 rounded-xl border border-[#222222] hover:border-[#00E99E]/50 transition-colors">
              <div className="bg-[#00E99E]/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-[#00E99E]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Social Monitoring</h3>
              <p className="text-gray-400 mb-4">
                Comprehensive monitoring of social platforms for real-time DeFi
                sentiment analysis.
              </p>
              <ul className="space-y-2">
                {[
                  "Twitter Integration",
                  "Discord Monitoring",
                  "News Analysis",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-gray-400"
                  >
                    <CheckCircle className="h-4 w-4 text-[#00E99E]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-[#080808] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How SentTrade Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI-powered platform continuously monitors social sentiment to
              execute optimized trading strategies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-black/40 p-6 rounded-xl border border-[#222222] relative">
              <div className="absolute -top-4 -left-4 bg-[#00E99E] w-8 h-8 rounded-full flex items-center justify-center text-black font-bold">
                1
              </div>
              <div className="bg-[#00E99E]/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-[#00E99E]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Social Monitoring</h3>
              <p className="text-sm text-gray-400">
                Our AI monitors Twitter, Discord, and news sources for real-time
                sentiment about DeFi tokens
              </p>
            </div>

            <div className="bg-black/40 p-6 rounded-xl border border-[#222222] relative">
              <div className="absolute -top-4 -left-4 bg-[#00E99E] w-8 h-8 rounded-full flex items-center justify-center text-black font-bold">
                2
              </div>
              <div className="bg-[#00E99E]/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-[#00E99E]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sentiment Analysis</h3>
              <p className="text-sm text-gray-400">
                Natural language processing classifies posts as positive,
                negative, or neutral with 95% accuracy
              </p>
            </div>

            <div className="bg-black/40 p-6 rounded-xl border border-[#222222] relative">
              <div className="absolute -top-4 -left-4 bg-[#00E99E] w-8 h-8 rounded-full flex items-center justify-center text-black font-bold">
                3
              </div>
              <div className="bg-[#00E99E]/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-[#00E99E]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Strategy Generation
              </h3>
              <p className="text-sm text-gray-400">
                AI combines sentiment data with on-chain metrics to generate
                optimized trading strategies
              </p>
            </div>

            <div className="bg-black/40 p-6 rounded-xl border border-[#222222] relative">
              <div className="absolute -top-4 -left-4 bg-[#00E99E] w-8 h-8 rounded-full flex items-center justify-center text-black font-bold">
                4
              </div>
              <div className="bg-[#00E99E]/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-[#00E99E]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sonic Execution</h3>
              <p className="text-sm text-gray-400">
                Trades execute instantly on Sonic's DeFi protocols with 10,000
                TPS and sub-second finality
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#00E99E]/10 to-black relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Trade with the Power of AI?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of traders using SentTrade to make data-driven
            decisions
          </p>
          <p className="mt-6 text-sm text-gray-500">
            No credit card required. Connect your wallet to start.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black border-t border-[#222222]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="bg-[#00E99E] w-9 h-9 rounded-lg flex items-center justify-center">
                <LineChart className="h-5 w-5 text-black" />
              </div>
              <div className="font-bold text-xl tracking-tight">
                Sent<span className="text-[#00E99E]">Trade</span>
                <span className="text-gray-500 font-normal text-sm">.ai</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              <Link
                href="#features"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#about"
                className="text-gray-400 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Blog
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="border-t border-[#222222] pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              © 2025 SentTrade. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
