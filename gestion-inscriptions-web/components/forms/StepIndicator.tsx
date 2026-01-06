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
      {/* Mobile: Affichage simplifié */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-gray-500">
            Étape {currentStep} sur {steps.length}
          </span>
          <span className="text-sm font-medium text-gray-900">
            {steps[currentStep - 1]?.title}
          </span>
        </div>
        <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-primary-600 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: Affichage complet */}
      <div className="hidden sm:block">
        <ol className="flex items-center w-full">
          {steps.map((step, index) => (
            <li
              key={step.number}
              className={cn(
                'flex items-center',
                index !== steps.length - 1 ? 'flex-1' : 'flex-initial'
              )}
            >
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300',
                    step.number === currentStep &&
                      'bg-primary-600 shadow-lg shadow-primary-600/30',
                    step.number < currentStep &&
                      'bg-primary-600',
                    step.number > currentStep &&
                      'bg-gray-200'
                  )}
                >
                  {step.number < currentStep ? (
                    <Check className="h-5 w-5 text-white" strokeWidth={2.5} />
                  ) : (
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        step.number === currentStep && 'text-white',
                        step.number > currentStep && 'text-gray-500'
                      )}
                    >
                      {step.number}
                    </span>
                  )}
                </div>

                {/* Step Info */}
                <div className="mt-3 text-center max-w-[120px]">
                  <p
                    className={cn(
                      'text-sm font-medium transition-colors',
                      step.number === currentStep && 'text-gray-900',
                      step.number < currentStep && 'text-gray-700',
                      step.number > currentStep && 'text-gray-400'
                    )}
                  >
                    {step.title}
                  </p>
                  <p
                    className={cn(
                      'text-xs mt-1 hidden lg:block',
                      step.number === currentStep && 'text-gray-600',
                      step.number < currentStep && 'text-gray-500',
                      step.number > currentStep && 'text-gray-400'
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Line between steps */}
              {index !== steps.length - 1 && (
                <div className="flex-1 h-1 mx-4 relative">
                  <div className="absolute inset-0 bg-gray-200 rounded-full" />
                  <div
                    className={cn(
                      'absolute inset-0 rounded-full transition-all duration-500',
                      step.number < currentStep ? 'bg-primary-600' : 'bg-transparent'
                    )}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
