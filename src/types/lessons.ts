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
  order_index?: number;
  sentences?: Sentence[];
  card_ids?: string[];
  content?: string;
  category?: LessonCategory;
}

export interface NewLesson {
  title: string;
  section_id?: string;
  order_index?: number;
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
  card_object: FSRSData;
  next_review: Date;
}

export interface FSRSData {
  state: number;
  step: number | null;
  stability: number | null;
  difficulty: number | null;
  last_review: string;
}

export interface ReviewLog {
  _id: string;
  lesson_id: string;
  user_id: string;
  review_date: string;
  rating: number;
}
