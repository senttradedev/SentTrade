import { NextResponse } from "next/server";
import axios from "axios";
import { SentimentAnalyzer } from "@/lib/services/sentiment-analysis";
import { twitterCache } from "@/lib/services/twitter-cache";

const sentimentAnalyzer = new SentimentAnalyzer();
const CACHE_KEY = "twitter_sentiment";

export async function GET() {
  try {
    // Check cache first
    const cachedData = twitterCache.get(CACHE_KEY);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Check rate limit
    const canProceed = await twitterCache.waitForRateLimit();
    if (!canProceed) {
      // Return cached data or empty response
      return NextResponse.json({
        tweets: [],
        sentimentGroups: { positive: [], neutral: [], negative: [] },
        averageSentiment: 0,
        timestamp: new Date().toISOString(),
      });
    }

    const response = await axios.get(
      "https://api.twitter.com/2/tweets/search/recent",
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
        params: {
          query: "(crypto OR bitcoin OR ethereum) lang:en -is:retweet",
          "tweet.fields": "created_at,public_metrics",
          max_results: 10, // Minimum allowed by Twitter
        },
      }
    );

    if (!response.data?.data) {
      const emptyData = {
        tweets: [],
        sentimentGroups: { positive: [], neutral: [], negative: [] },
        averageSentiment: 0,
        timestamp: new Date().toISOString(),
      };
      await twitterCache.set(CACHE_KEY, emptyData);
      return NextResponse.json(emptyData);
    }

    // Take only first 5 tweets for display
    const analyzedTweets = response.data.data.slice(0, 5).map((tweet: any) => ({
      id: tweet.id,
      text: tweet.text,
      sentiment: sentimentAnalyzer.analyzeSentiment(tweet.text),
      keywords: sentimentAnalyzer.analyzeKeywords(tweet.text),
      metrics: tweet.public_metrics || { like_count: 0, retweet_count: 0 },
      timestamp: tweet.created_at,
      platform: "twitter",
    }));

    const result = {
      tweets: analyzedTweets,
      sentimentGroups: {
        positive: analyzedTweets.filter((t: any) => t.sentiment >= 70),
        neutral: analyzedTweets.filter(
          (t: any) => t.sentiment > 30 && t.sentiment < 70
        ),
        negative: analyzedTweets.filter((t: any) => t.sentiment <= 30),
      },
      averageSentiment: analyzedTweets.length
        ? Math.round(
            analyzedTweets.reduce(
              (acc: number, t: any) => acc + t.sentiment,
              0
            ) / analyzedTweets.length
          )
        : 0,
      timestamp: new Date().toISOString(),
    };

    await twitterCache.set(CACHE_KEY, result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(
      "Error fetching Twitter sentiment:",
      error.response?.data || error.message
    );

    const cachedData = twitterCache.get(CACHE_KEY);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    return NextResponse.json({
      tweets: [],
      sentimentGroups: { positive: [], neutral: [], negative: [] },
      averageSentiment: 0,
      timestamp: new Date().toISOString(),
    });
  }
}
