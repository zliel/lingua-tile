import { Card } from "./cards";

export interface Sentence {
  full_sentence: string;
  possible_answers: string[];
  words: string[];
}

export type LessonCategory = "grammar" | "practice" | "flashcards";

export interface Lesson {
  _id: string;
  title: string;
  section_id?: string;
  sentences?: Sentence[];
  card_ids?: string[];
  content?: string;
  category?: LessonCategory;
}

export interface NewLesson {
  title: string;
  section_id?: string;
  sentences?: Sentence[];
  card_ids?: string[];
  content?: string;
  category?: LessonCategory | "";
}

// TODO: Split lessons into different types based on category

export interface ReviewStats {
  isOverdue: boolean;
  daysLeft: number;
}

// Implementation for review for later
export interface Review {
  _id: string;
  lesson_id: string;
  user_id: string;
  card_object: Card;
  next_review_date: Date;
}
