interface CachedData {
  data: any;
  timestamp: number;
}

class TwitterCache {
  private cache: Map<string, CachedData>;
  private lastRequestTime: number = 0;
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache
  private readonly REQUEST_DELAY = 60000; // 1 minute between requests (more conservative)
  private isRequesting: boolean = false;

  constructor() {
    this.cache = new Map();
  }

  async set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  async waitForRateLimit() {
    if (this.isRequesting) {
      return null;
    }

    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.REQUEST_DELAY) {
      return null;
    }

    this.isRequesting = true;
    this.lastRequestTime = now;

    try {
      return true;
    } finally {
      this.isRequesting = false;
    }
  }
}

export const twitterCache = new TwitterCache();
