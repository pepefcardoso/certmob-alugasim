import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OnboardingStep {
    label: string;
    done: boolean;
    href: string;
}

export function OnboardingTour({ steps }: { steps: OnboardingStep[] }) {
    const nextStep = steps.find((step) => !step.done);

    return (
        <div className="bg-surface space-y-4 rounded-xl border border-dashed border-neutral-300 p-6">
            <div className="space-y-1">
                <p className="text-heading-3 text-neutral-950">Comece por aqui</p>
                <p className="text-body-sm text-neutral-700">
                    3 passos rápidos para ver seu primeiro reajuste automático.
                </p>
            </div>
            <ol className="space-y-2">
                {steps.map((step, index) => (
                    <li
                        key={step.label}
                        className={cn(
                            'flex items-center gap-3 rounded-lg border px-3 py-2 text-sm',
                            step.done
                                ? 'border-success-100 bg-success-100/40 text-neutral-500'
                                : 'border-neutral-200',
                        )}
                    >
                        <span
                            className={cn(
                                'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                                step.done ? 'bg-success-700 text-white' : 'bg-neutral-200 text-neutral-700',
                            )}
                        >
                            {step.done ? <Check className="size-3.5" /> : index + 1}
                        </span>
                        <span className={step.done ? 'line-through' : ''}>{step.label}</span>
                    </li>
                ))}
            </ol>
            {nextStep && (
                <Button asChild className="mt-2">
                    <Link href={nextStep.href}>{nextStep.label}</Link>
                </Button>
            )}
        </div>
    );
}