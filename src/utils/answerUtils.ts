import dlModule from "damerau-levenshtein";

const dl = dlModule;

export interface AnswerResult {
  isCorrect: boolean;
  matchedAnswer?: string; // The correct answer that was matched
  isFuzzy?: boolean; // True if matched via fuzzy logic (typo tolerance)
  userFeedback?: string; // e.g. "Typos detected: 'X' -> 'Y'"
}

export const cleanString = (inputString: string): string => {
  return inputString
    .trim()
    .toLowerCase()
    .replaceAll(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
};

export const checkAnswer = (userAnswer: string, possibleAnswers: string[]): AnswerResult => {
  const cleanedUserAnswer = cleanString(userAnswer);

  if (!cleanedUserAnswer) {
    return { isCorrect: false };
  }

  // 1. Exact Match Check
  for (const answer of possibleAnswers) {
    const cleanedAnswer = cleanString(answer);
    if (cleanedUserAnswer === cleanedAnswer) {
      return { isCorrect: true, matchedAnswer: answer, isFuzzy: false };
    }
  }

  // 2. Fuzzy Match Check
  // Allow 1 edit distance per 5 characters of length, with a minimum of 1 if length >= 3.
  // Using Damerau-Levenshtein to account for transpositions (e.g. "teh" -> "the") as 1 step.
  for (const answer of possibleAnswers) {
    const cleanedAnswer = cleanString(answer);
    let response;
    try {
      response = dl(cleanedUserAnswer, cleanedAnswer);
    } catch (e) {
      console.error("DL error", e);
      response = { steps: 99 };
    }

    const distance = response.steps;

    // Calculate allowed errors based on answer length
    let allowedErrors = 0;
    const len = cleanedAnswer.length;

    if (len > 15) allowedErrors = 3;
    else if (len >= 8) allowedErrors = 2;
    else if (len >= 3) allowedErrors = 1;

    if (distance <= allowedErrors && distance > 0) {
      return {
        isCorrect: true,
        matchedAnswer: answer,
        isFuzzy: true,
        userFeedback: `You typed: "${userAnswer}". Correct answer: "${answer}"`
      };
    }
  }

  return { isCorrect: false };
};

