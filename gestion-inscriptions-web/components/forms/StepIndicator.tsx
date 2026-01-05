import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => (
          <li
            key={step.number}
            className={cn(
              'relative flex-1',
              index !== steps.length - 1 && 'pr-8 sm:pr-20'
            )}
          >
            {/* Progress Line */}
            {index !== steps.length - 1 && (
              <div
                className="absolute top-4 left-0 -ml-px mt-0.5 h-0.5 w-full"
                aria-hidden="true"
              >
                <div
                  className={cn(
                    'h-full transition-colors duration-500',
                    step.number < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  )}
                />
              </div>
            )}

            {/* Step Circle */}
            <div className="group relative flex items-start">
              <span className="flex h-9 items-center" aria-hidden="true">
                <span
                  className={cn(
                    'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300',
                    step.number === currentStep &&
                      'border-primary-600 bg-white',
                    step.number < currentStep &&
                      'border-primary-600 bg-primary-600',
                    step.number > currentStep &&
                      'border-gray-300 bg-white group-hover:border-gray-400'
                  )}
                >
                  {step.number < currentStep ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        step.number === currentStep && 'text-primary-600',
                        step.number > currentStep && 'text-gray-500'
                      )}
                    >
                      {step.number}
                    </span>
                  )}
                </span>
              </span>

              {/* Step Info */}
              <span className="ml-4 flex min-w-0 flex-col">
                <span
                  className={cn(
                    'text-sm font-medium transition-colors',
                    step.number === currentStep && 'text-primary-600',
                    step.number < currentStep && 'text-primary-600',
                    step.number > currentStep && 'text-gray-500'
                  )}
                >
                  {step.title}
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">
                  {step.description}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
