export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  datesCompleted: string[];
  createdAt: string;
  currentStreak: number;
  longestStreak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'streak' | 'completion' | 'milestone';
  earned: boolean;
  dateEarned?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  totalHabitsCompleted: number;
  badges: Badge[];
  joinedAt: string;
}