import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar, Flame, Trophy } from 'lucide-react';
import { Habit } from '@/types/habit';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onToggleCompletion: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
}

export const HabitCard = ({ habit, onToggleCompletion, onDelete }: HabitCardProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const isCompletedToday = habit.datesCompleted.includes(selectedDate);
  const completionRate = habit.datesCompleted.length > 0 ? 
    Math.round((habit.datesCompleted.length / Math.max(1, getDaysSinceCreation(habit.createdAt))) * 100) : 0;

  return (
    <Card className="bg-card border-border hover:bg-muted/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">{habit.name}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(habit.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {habit.description && (
          <p className="text-sm text-muted-foreground mb-4">{habit.description}</p>
        )}
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-input border border-border rounded px-2 py-1 text-sm text-foreground"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => onToggleCompletion(habit.id, selectedDate)}
            className={cn(
              "flex-1 mr-2",
              isCompletedToday 
                ? "bg-success hover:bg-success/80 text-success-foreground" 
                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            )}
          >
            {isCompletedToday ? '✅ Completed' : '⭕ Mark Complete'}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center p-2 bg-muted rounded">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="h-4 w-4 text-streak" />
              <span className="font-semibold text-streak">{habit.currentStreak}</span>
            </div>
            <p className="text-muted-foreground text-xs">Current</p>
          </div>
          
          <div className="text-center p-2 bg-muted rounded">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="h-4 w-4 text-warning" />
              <span className="font-semibold text-warning">{habit.longestStreak}</span>
            </div>
            <p className="text-muted-foreground text-xs">Best</p>
          </div>
          
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-semibold text-primary mb-1">{completionRate}%</div>
            <p className="text-muted-foreground text-xs">Rate</p>
          </div>
        </div>

        <div className="mt-3">
          <Badge variant="secondary" className="text-xs">
            {habit.datesCompleted.length} completions
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

function getDaysSinceCreation(createdAt: string): number {
  const created = new Date(createdAt);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}