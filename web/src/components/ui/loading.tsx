import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  className?: string;
  text?: string;
}

export function Loading({ size = 'md', variant = 'spinner', className, text }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  if (variant === 'spinner') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div
          className={cn(
            'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
            sizeClasses[size],
          )}
        />
        {text && <p className={cn('text-gray-600', textSizeClasses[size])}>{text}</p>}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'bg-blue-600 rounded-full animate-pulse',
                size === 'sm'
                  ? 'w-2 h-2'
                  : size === 'md'
                    ? 'w-3 h-3'
                    : size === 'lg'
                      ? 'w-4 h-4'
                      : 'w-5 h-5',
              )}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
        {text && <p className={cn('text-gray-600', textSizeClasses[size])}>{text}</p>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center gap-2', className)}>
        <div className={cn('bg-blue-600 rounded-full animate-pulse', sizeClasses[size])} />
        {text && <p className={cn('text-gray-600 animate-pulse', textSizeClasses[size])}>{text}</p>}
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={cn('flex flex-col items-center gap-2', className)}>
        <div className="flex items-end space-x-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                'bg-blue-600 animate-pulse',
                size === 'sm' ? 'w-1' : size === 'md' ? 'w-1.5' : size === 'lg' ? 'w-2' : 'w-3',
              )}
              style={{
                height:
                  size === 'sm' ? '12px' : size === 'md' ? '16px' : size === 'lg' ? '20px' : '24px',
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s',
              }}
            />
          ))}
        </div>
        {text && <p className={cn('text-gray-600', textSizeClasses[size])}>{text}</p>}
      </div>
    );
  }

  return null;
}
