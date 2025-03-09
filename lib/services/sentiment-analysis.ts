import * as natural from "natural";
import { TokenizerType } from "./types";

export class SentimentAnalyzer {
  private analyzer: any;
  private tokenizer: TokenizerType;

  constructor() {
    this.analyzer = new natural.SentimentAnalyzer(
      "English",
      natural.PorterStemmer,
      "afinn"
    );
    this.tokenizer = new natural.WordTokenizer();
  }

  analyzeSentiment(text: string) {
    const tokens = this.tokenizer.tokenize(text);
    if (!tokens) return 0;

    const score = this.analyzer.getSentiment(tokens);
    // Normalize score to 0-100 range
    return Math.round((score + 1) * 50);
  }

  analyzeKeywords(text: string) {
    const tokens = this.tokenizer.tokenize(text);
    if (!tokens) return [];

    // Remove common words and normalize
    const keywords = tokens.filter(
      (token: any) => token.length > 3 && !this.isCommonWord(token)
    );

    return keywords;
  }

  private isCommonWord(word: string): boolean {
    const commonWords = ["the", "is", "at", "which", "on", "and"];
    return commonWords.includes(word.toLowerCase());
  }
}
