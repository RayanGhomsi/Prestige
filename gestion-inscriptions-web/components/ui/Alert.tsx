import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, children, ...props }, ref) => {
    const variants = {
      info: {
        container: 'bg-blue-50 border-blue-200 text-blue-900',
        icon: Info,
        iconColor: 'text-blue-600',
      },
      success: {
        container: 'bg-green-50 border-green-200 text-green-900',
        icon: CheckCircle2,
        iconColor: 'text-green-600',
      },
      warning: {
        container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        icon: AlertCircle,
        iconColor: 'text-yellow-600',
      },
      error: {
        container: 'bg-red-50 border-red-200 text-red-900',
        icon: XCircle,
        iconColor: 'text-red-600',
      },
    };

    const { container, icon: Icon, iconColor } = variants[variant];

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-lg border p-4',
          container,
          className
        )}
        role="alert"
        {...props}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <Icon className={cn('h-5 w-5', iconColor)} aria-hidden="true" />
          </div>
          <div className="ml-3">
            {title && <h3 className="text-sm font-medium">{title}</h3>}
            <div className={cn('text-sm', title && 'mt-2')}>{children}</div>
          </div>
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
