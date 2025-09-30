import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Habit } from '@/types/habit';
import { cn } from '@/lib/utils';

interface HabitCalendarProps {
  habits: Habit[];
  onToggleCompletion: (habitId: string, date: string) => void;
}

export const HabitCalendar = ({ habits, onToggleCompletion }: HabitCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getCompletionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return habits.filter(habit => habit.datesCompleted.includes(dateStr));
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Habit Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="border-border"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-foreground min-w-[120px] text-center">
              {formatMonthYear(currentDate)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="border-border"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const completions = getCompletionsForDate(day);
            const completionCount = completions.length;
            const totalHabits = habits.length;
            const completionRate = totalHabits > 0 ? completionCount / totalHabits : 0;
            
            return (
              <div
                key={index}
                className={cn(
                  "relative aspect-square p-1 rounded border border-border text-center transition-colors",
                  isCurrentMonth(day) ? "bg-card" : "bg-muted/30",
                  isToday(day) && "ring-2 ring-primary ring-offset-1 ring-offset-background"
                )}
              >
                <div className={cn(
                  "text-xs font-medium",
                  isCurrentMonth(day) ? "text-foreground" : "text-muted-foreground"
                )}>
                  {day.getDate()}
                </div>
                
                {completionCount > 0 && (
                  <div className="mt-1 space-y-0.5">
                    <div 
                      className={cn(
                        "w-4 h-1 mx-auto rounded-full",
                        completionRate === 1 ? "bg-success" :
                        completionRate >= 0.7 ? "bg-warning" :
                        completionRate >= 0.3 ? "bg-accent" : "bg-muted-foreground"
                      )}
                    />
                    <div className="text-[10px] text-muted-foreground">
                      {completionCount}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-success rounded-full" />
            <span>All habits</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-warning rounded-full" />
            <span>Most habits</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-accent rounded-full" />
            <span>Some habits</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};