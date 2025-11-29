import { AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: 'error' | 'warning';
  className?: string;
}

export function ErrorMessage({
  title,
  message,
  type = 'error',
  className = '',
}: ErrorMessageProps) {
  const isError = type === 'error';

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border',
        isError
          ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-yellow-50 border-yellow-200 text-yellow-800',
        className,
      )}
      role="alert"
    >
      {isError ? (
        <XCircle className="h-5 w-5 shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 shrink-0" />
      )}
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
