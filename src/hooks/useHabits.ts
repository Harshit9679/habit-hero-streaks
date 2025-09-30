import { useState, useEffect } from 'react';
import { Habit, Badge } from '@/types/habit';

const STORAGE_KEY = 'habitHero_habits';
const BADGES_KEY = 'habitHero_badges';

const defaultBadges: Badge[] = [
  {
    id: '1',
    name: 'First Step',
    description: 'Complete your first habit',
    icon: '🎯',
    requirement: 1,
    type: 'completion',
    earned: false
  },
  {
    id: '2',
    name: '3-Day Streak',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    requirement: 3,
    type: 'streak',
    earned: false
  },
  {
    id: '3',
    name: '7-Day Warrior',
    description: 'Achieve a 7-day streak',
    icon: '⚔️',
    requirement: 7,
    type: 'streak',
    earned: false
  },
  {
    id: '4',
    name: 'Consistency King',
    description: 'Complete 30 habits total',
    icon: '👑',
    requirement: 30,
    type: 'milestone',
    earned: false
  },
  {
    id: '5',
    name: 'Legend',
    description: 'Achieve a 21-day streak',
    icon: '🏆',
    requirement: 21,
    type: 'streak',
    earned: false
  }
];

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [badges, setBadges] = useState<Badge[]>(defaultBadges);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem(STORAGE_KEY);
    const savedBadges = localStorage.getItem(BADGES_KEY);
    
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
    
    if (savedBadges) {
      setBadges(JSON.parse(savedBadges));
    }
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  // Save badges to localStorage
  useEffect(() => {
    localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
  }, [badges]);

  const addHabit = (name: string, description: string = '', color: string = '#22c55e') => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      description,
      color,
      datesCompleted: [],
      createdAt: new Date().toISOString(),
      currentStreak: 0,
      longestStreak: 0
    };
    
    setHabits(prev => [...prev, newHabit]);
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;

      const isCompleted = habit.datesCompleted.includes(date);
      let newDatesCompleted: string[];
      
      if (isCompleted) {
        newDatesCompleted = habit.datesCompleted.filter(d => d !== date);
      } else {
        newDatesCompleted = [...habit.datesCompleted, date].sort();
      }

      const { currentStreak, longestStreak } = calculateStreaks(newDatesCompleted);
      
      const updatedHabit = {
        ...habit,
        datesCompleted: newDatesCompleted,
        currentStreak,
        longestStreak
      };

      // Check for new badges
      checkAndAwardBadges(updatedHabit, newDatesCompleted.length);
      
      return updatedHabit;
    }));
  };

  const calculateStreaks = (datesCompleted: string[]) => {
    if (datesCompleted.length === 0) return { currentStreak: 0, longestStreak: 0 };

    const sortedDates = datesCompleted.sort();
    const today = new Date().toISOString().split('T')[0];
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    // Calculate current streak from today backwards
    let checkDate = new Date(today);
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sortedDates.includes(dateStr)) {
        currentStreak = i === 0 ? 1 : currentStreak + 1;
      } else if (i === 0) {
        // If today is not completed, check yesterday
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      } else {
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate longest streak
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  };

  const checkAndAwardBadges = (habit: Habit, totalCompletions: number) => {
    setBadges(prev => prev.map(badge => {
      if (badge.earned) return badge;

      let shouldEarn = false;
      
      if (badge.type === 'completion' && totalCompletions >= badge.requirement) {
        shouldEarn = true;
      } else if (badge.type === 'streak' && habit.currentStreak >= badge.requirement) {
        shouldEarn = true;
      } else if (badge.type === 'milestone') {
        const totalHabitsCompleted = habits.reduce((sum, h) => sum + h.datesCompleted.length, 0);
        if (totalHabitsCompleted >= badge.requirement) {
          shouldEarn = true;
        }
      }

      if (shouldEarn) {
        return {
          ...badge,
          earned: true,
          dateEarned: new Date().toISOString()
        };
      }
      
      return badge;
    }));
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  };

  return {
    habits,
    badges,
    addHabit,
    toggleHabitCompletion,
    deleteHabit,
    earnedBadges: badges.filter(b => b.earned),
    totalHabitsCompleted: habits.reduce((sum, habit) => sum + habit.datesCompleted.length, 0)
  };
};