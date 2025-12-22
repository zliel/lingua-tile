import { describe, it, expect } from "vitest";
import { checkAnswer } from "./answerUtils";

describe("answerUtils", () => {
  describe("checkAnswer", () => {
    it("should return correct for exact matches", () => {
      const possible = ["hello world", "hi world"];
      const result = checkAnswer("hello world", possible);
      expect(result.isCorrect).toBe(true);
      expect(result.isFuzzy).toBe(false);
    });

    it("should ignore punctuation and case", () => {
      const possible = ["Hello World!"];
      const result = checkAnswer("hello world", possible);
      expect(result.isCorrect).toBe(true);
    });

    it("should be locale-aware", () => {
      const possible = ["私は兵士じゃない"];
      const result = checkAnswer("私は兵士じゃない", possible);
      expect(result.isCorrect).toBe(true);
    });
  });

  it("should fail for completely wrong answers", () => {
    const possible = ["apple"];
    const result = checkAnswer("banana", possible);
    expect(result.isCorrect).toBe(false);
  });

  it("should allow small typos for medium words (fuzzy match)", () => {
    // "apple" length 5 -> allows 1 error
    const possible = ["apple"];
    const result = checkAnswer("aple", possible); // missing 'p' (dist 1)
    expect(result.isCorrect).toBe(true);
    expect(result.isFuzzy).toBe(true);
  });

  it("should allow more typos for long sentneces", () => {
    // length > 15 -> allows 3 errors
    const target = "this is a very long sentence";
    const possible = [target];
    // "this is a veri log sentense" -> 'very'->'veri' (1), 'long'->'log' (1), 'sentence'->'sentense' (1) = 3 errors
    const result = checkAnswer("this is a veri log sentense", possible);
    expect(result.isCorrect).toBe(true);
    expect(result.isFuzzy).toBe(true);
  });

  // Also validating transposition support "teh" -> "the"
  it("should allow 1 typo for length 3 words (Transposition supported)", () => {
    // "the" length 3 -> allows 1 error
    const possible = ["the"];
    // "teh" -> 1 step in Damerau-Levenshtein (transposition)
    const result = checkAnswer("teh", possible);
    expect(result.isCorrect).toBe(true);
    expect(result.isFuzzy).toBe(true);

    // "tha" -> 1 step (substitution)
    const result2 = checkAnswer("tha", possible);
    expect(result2.isCorrect).toBe(true);
  });

  it("should NOT allow typos for very short words (len < 3)", () => {
    // "it" length 2 -> allows 0 errors
    const possible = ["it"];
    const result = checkAnswer("ti", possible); // 1 transposition, but len 2 < 3.
    // length 2 allows 0 errors
    expect(result.isCorrect).toBe(false);
  });

  it("should NOT allow too many typos", () => {
    // "apple" length 5 -> allows 1 error
    const possible = ["apple"];
    const result = checkAnswer("aplz", possible); // dist 2 or 3
    expect(result.isCorrect).toBe(false);
  });
});
