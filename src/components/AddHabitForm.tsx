import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface AddHabitFormProps {
  onAddHabit: (name: string, description: string, color: string) => void;
}

const habitColors = [
  '#22c55e', // green
  '#3b82f6', // blue  
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
];

export const AddHabitForm = ({ onAddHabit }: AddHabitFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(habitColors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onAddHabit(name.trim(), description.trim(), selectedColor);
    setName('');
    setDescription('');
    setSelectedColor(habitColors[0]);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Card className="bg-muted/50 border-dashed border-2 border-border hover:bg-muted transition-colors cursor-pointer">
        <CardContent className="flex items-center justify-center p-8">
          <Button
            onClick={() => setIsOpen(true)}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Habit
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg">Create New Habit</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="habit-name" className="text-sm font-medium text-foreground">
              Habit Name *
            </Label>
            <Input
              id="habit-name"
              type="text"
              placeholder="e.g., Read 10 pages, Exercise, Meditate"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="habit-description" className="text-sm font-medium text-foreground">
              Description (optional)
            </Label>
            <Textarea
              id="habit-description"
              placeholder="Add details about your habit..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground">Color</Label>
            <div className="flex gap-2 mt-2">
              {habitColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color ? 'border-foreground scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="bg-primary hover:bg-primary/80 text-primary-foreground">
              Create Habit
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};