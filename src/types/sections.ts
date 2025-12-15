export interface Section {
  _id: string;
  name: string;
  order_index?: number;
  lesson_ids: string[];
}

export interface NewSection {
  name: string;
  order_index?: number;
  lesson_ids: string[];
}
