export type Role = "admin" | "user";

export interface User {
  _id: string;
  username: string;
  roles: Role[];
  completedLessons?: string[];
  current_streak?: number;
  timezone?: string;
}

export interface NewUser {
  username: string;
  password: string;
  roles?: Role[];
  completedLessons?: string[];
}
