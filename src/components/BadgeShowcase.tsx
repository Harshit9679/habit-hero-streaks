import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Badge as BadgeType } from '@/types/habit';
import { Trophy, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeShowcaseProps {
  badges: BadgeType[];
}

export const BadgeShowcase = ({ badges }: BadgeShowcaseProps) => {
  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-badge" />
          Trophy Room
          <Badge variant="secondary" className="ml-auto">
            {earnedBadges.length}/{badges.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={cn(
                "relative p-4 rounded-lg border-2 transition-all",
                badge.earned 
                  ? "bg-badge/10 border-badge shadow-lg" 
                  : "bg-muted/50 border-muted-foreground/20"
              )}
            >
              {!badge.earned && (
                <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
                  <Lock className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              
              <div className="text-center">
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h3 className={cn(
                  "font-semibold text-sm mb-1",
                  badge.earned ? "text-badge-foreground" : "text-muted-foreground"
                )}>
                  {badge.name}
                </h3>
                <p className={cn(
                  "text-xs",
                  badge.earned ? "text-muted-foreground" : "text-muted-foreground/60"
                )}>
                  {badge.description}
                </p>
                
                {badge.earned && badge.dateEarned && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      Earned {new Date(badge.dateEarned).toLocaleDateString()}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {earnedBadges.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Complete habits to earn your first badge!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};