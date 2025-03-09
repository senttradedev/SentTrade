import { NextResponse } from "next/server";
import axios from "axios";
import { twitterCache } from "@/lib/services/twitter-cache";

const CACHE_KEY = "sentiment_data";

export async function GET() {
  try {
    // Check cache first
    const cachedData = twitterCache.get(CACHE_KEY);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // If no cache, fetch directly from Twitter
    await twitterCache.waitForRateLimit();

    const response = await axios.get(
      "https://api.twitter.com/2/tweets/search/recent",
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
        params: {
          query: "(crypto OR bitcoin OR ethereum) lang:en -is:retweet",
          "tweet.fields": "created_at,public_metrics",
          max_results: 5,
        },
      }
    );

    if (!response.data?.data) {
      return NextResponse.json({
        twitter: { posts: [] },
        reddit: { posts: [] },
      });
    }

    const result = {
      twitter: {
        posts: response.data.data.map((tweet: any) => ({
          text: tweet.text,
          sentiment: Math.floor(Math.random() * 100), // We'll replace this with real sentiment later
          platform: "twitter",
          timestamp: tweet.created_at,
        })),
      },
      reddit: {
        posts: [],
      },
    };

    await twitterCache.set(CACHE_KEY, result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(
      "Error fetching sentiment data:",
      error.response?.data || error.message
    );

    const cachedData = twitterCache.get(CACHE_KEY);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    return NextResponse.json({
      twitter: { posts: [] },
      reddit: { posts: [] },
    });
  }
}
