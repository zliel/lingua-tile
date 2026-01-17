export type Role = "admin" | "user";

export interface User {
  _id: string;
  username: string;
  email: string;
  roles: Role[];
  completedLessons?: string[];
  current_streak?: number;
  timezone?: string;
  level?: number;
  xp?: number;
  learning_mode?: "map" | "list";
}

export interface NewUser {
  username: string;
  password: string;
  email: string;
  roles?: Role[];
  completedLessons?: string[];
}
