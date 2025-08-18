'use client';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TagProps {
  text: string;
  variant?: 'normal' | 'highlight';
  onClick?: (e: React.MouseEvent) => void;
}

export function Tag({ text, variant = 'normal', onClick }: TagProps) {
  return (
    <Badge
      variant={variant === 'highlight' ? 'default' : 'secondary'}
      className={cn(
        'cursor-pointer transition-all duration-200 hover:scale-105',
        variant === 'highlight'
          ? 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
          : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200',
        'text-xs px-2 py-1'
      )}
      onClick={onClick}
    >
      #{text}
    </Badge>
  );
}
