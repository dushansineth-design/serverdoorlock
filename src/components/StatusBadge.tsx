import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'locked' | 'unlocked' | 'active' | 'inactive';
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const variants = {
    locked: 'bg-destructive/10 text-destructive border-destructive/20',
    unlocked: 'bg-success/10 text-success border-success/20',
    active: 'bg-success/10 text-success border-success/20',
    inactive: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <Badge variant="outline" className={cn(variants[status], className)}>
      {status}
    </Badge>
  );
};
