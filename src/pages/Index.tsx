import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HabitCard } from '@/components/HabitCard';
import { AddHabitForm } from '@/components/AddHabitForm';
import { BadgeShowcase } from '@/components/BadgeShowcase';
import { ProgressStats } from '@/components/ProgressStats';
import { HabitCalendar } from '@/components/HabitCalendar';
import { useHabits } from '@/hooks/useHabits';
import { useToast } from '@/hooks/use-toast';
import { Target, Trophy, BarChart3, Calendar, Sparkles } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const Index = () => {
  const { habits, badges, addHabit, toggleHabitCompletion, deleteHabit, earnedBadges, totalHabitsCompleted } = useHabits();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('habits');

  const handleAddHabit = (name: string, description: string, color: string) => {
    addHabit(name, description, color);
    toast({
      title: "Habit created!",
      description: `"${name}" has been added to your habits.`,
    });
  };

  const handleToggleCompletion = (habitId: string, date: string) => {
    const habit = habits.find(h => h.id === habitId);
    const wasCompleted = habit?.datesCompleted.includes(date);
    
    toggleHabitCompletion(habitId, date);
    
    toast({
      title: wasCompleted ? "Habit unchecked" : "Great job! 🎉",
      description: wasCompleted 
        ? "Habit marked as incomplete for this date."
        : "You're building momentum with your habits!",
    });
  };

  const handleDeleteHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    deleteHabit(habitId);
    toast({
      title: "Habit deleted",
      description: `"${habit?.name}" has been removed.`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/20 via-background to-accent/20 border-b border-border">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-badge" />
                <Badge variant="secondary" className="bg-badge/10 text-badge-foreground border-badge/20">
                  Daily Habit Hero
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Build <span className="text-primary">Daily Habits</span>
                <br />
                Unlock Your <span className="text-streak">Potential</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Track your habits, build powerful streaks, and earn badges as you transform your daily routine into a path to success.
              </p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-foreground">{habits.length} Active Habits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-badge" />
                  <span className="text-foreground">{earnedBadges.length} Badges Earned</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Daily Habit Hero" 
                className="rounded-lg shadow-2xl border border-border"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted border border-border">
            <TabsTrigger value="habits" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">My Habits</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Badges</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="habits" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AddHabitForm onAddHabit={handleAddHabit} />
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggleCompletion={handleToggleCompletion}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </div>
            
            {habits.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No habits yet!</h3>
                <p>Create your first habit to start building better daily routines.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <HabitCalendar 
              habits={habits} 
              onToggleCompletion={handleToggleCompletion}
            />
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <ProgressStats 
              habits={habits} 
              totalCompleted={totalHabitsCompleted}
            />
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <BadgeShowcase badges={badges} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;