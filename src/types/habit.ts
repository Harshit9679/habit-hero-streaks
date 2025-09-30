export interface Habit {
  id: string;
  name: string;
  description: string;
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
  type: 'completion' | 'streak' | 'milestone';
  earned: boolean;
  dateEarned?: string;
}