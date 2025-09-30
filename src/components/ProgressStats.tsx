import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Habit } from '@/types/habit';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Flame, Target, TrendingUp } from 'lucide-react';

interface ProgressStatsProps {
  habits: Habit[];
  totalCompleted: number;
}

export const ProgressStats = ({ habits, totalCompleted }: ProgressStatsProps) => {
  // Calculate weekly progress data
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - today.getDay() + index);
      const dateStr = date.toISOString().split('T')[0];
      
      const completions = habits.reduce((count, habit) => {
        return count + (habit.datesCompleted.includes(dateStr) ? 1 : 0);
      }, 0);

      return {
        day,
        completions,
        date: dateStr
      };
    });

    return weekData;
  };

  const weeklyData = getWeeklyData();
  const totalStreaks = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);
  const longestStreak = Math.max(...habits.map(h => h.longestStreak), 0);
  const activeHabits = habits.length;
  const weeklyCompletions = weeklyData.reduce((sum, day) => sum + day.completions, 0);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Active Habits</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">{activeHabits}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Total Done</span>
            </div>
            <div className="text-2xl font-bold text-success mt-1">{totalCompleted}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-streak" />
              <span className="text-sm text-muted-foreground">Total Streaks</span>
            </div>
            <div className="text-2xl font-bold text-streak mt-1">{totalStreaks}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">Best Streak</span>
            </div>
            <div className="text-2xl font-bold text-warning mt-1">{longestStreak}</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">This Week's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar 
                  dataKey="completions" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <span className="font-medium text-primary">{weeklyCompletions}</span> habits completed this week
          </div>
        </CardContent>
      </Card>
    </div>
  );
};