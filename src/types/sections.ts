export interface Section {
  _id: string;
  name: string;
  lesson_ids: string[];
}

export interface NewSection {
  name: string;
  lesson_ids: string[];
}
