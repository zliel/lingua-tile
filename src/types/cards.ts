export interface Card {
  _id: string;
  front_text: string;
  back_text: string;
  lesson_ids?: string[];
}

export interface NewCard {
  front_text: string;
  back_text: string;
  lesson_ids?: string[];
}
