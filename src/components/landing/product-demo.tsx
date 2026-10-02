'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { CircleCheck, Clock3, MousePointer2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FinancialSummaryCard } from '@/components/domain/financial-summary-card';
import { PropertyCard } from '@/components/domain/property-card';
import { PaymentCard } from '@/components/domain/payment-card';
import { AdjustmentPreview } from '@/components/domain/adjustment-preview';
import type { PaymentStatusVariant } from '@/components/domain/status-badge';
import { STATUS_LABEL_PT } from '@/lib/payment-status';
import { FALLBACK_RATES } from '@/components/landing/constants';
import { cn } from '@/lib/utils';

const RENT = 2000;
const RATE = FALLBACK_RATES.IGPM;
const NEW_RENT = Math.round(RENT * (1 + RATE / 100) * 100) / 100;
const DUE_DATE = new Date(Date.now() + 3 * 86_400_000);

type Target = 'apply' | 'confirm' | 'rest';

const TIMELINE: { at: number; step: number; cursor: Target }[] = [
  { at: 0, step: 0, cursor: 'rest' },
  { at: 1400, step: 1, cursor: 'apply' },
  { at: 2400, step: 2, cursor: 'apply' }, // clique → "Calculando..."
  { at: 3200, step: 3, cursor: 'apply' }, // conta aparece
  { at: 5600, step: 4, cursor: 'confirm' },
  { at: 6500, step: 5, cursor: 'confirm' }, // clique → aplicado, cobrança enviada
  { at: 7600, step: 6, cursor: 'rest' }, // pagamento recebido
];
const LOOP_MS = 11_500;
const LAST_STEP = 6;

const CAPTIONS = [
  {
    title: 'Reajuste disponível',
    text: 'O contrato completa 12 meses e o Alugasim avisa.',
    steps: [0, 1],
  },
  {
    title: 'Conta à vista',
    text: 'Aluguel atual × (1 + índice) = novo aluguel, com a taxa oficial.',
    steps: [2, 3, 4],
  },
  {
    title: 'Cobrança e recebimento',
    text: 'Lembrete enviado ao inquilino e pagamento registrado no painel.',
    steps: [5, 6],
  },
];

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_QUERY).matches;
}

function locate(
  target: Target,
  body: HTMLElement | null,
  apply: HTMLElement | null,
  confirm: HTMLElement | null,
) {
  if (!body) return null;
  const b = body.getBoundingClientRect();
  if (target === 'rest') return { x: b.width * 0.75, y: b.height - 48 };
  const el = target === 'apply' ? apply : confirm;
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left - b.left + r.width * 0.6, y: r.top - b.top + r.height * 0.55 };
}

export function ProductDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const applyRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const [inView, setInView] = useState(false);
  const [step, setStep] = useState(0);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const playing = inView && !reduced;

  useEffect(() => {
    if (!playing) return;
    let timers: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      timers = TIMELINE.map(({ at, step: next, cursor: target }) =>
        setTimeout(() => {
          setStep(next);
          const pos = locate(target, bodyRef.current, applyRef.current, confirmRef.current);
          if (pos) setCursor(pos);
        }, at),
      );
      timers.push(setTimeout(run, LOOP_MS));
    };

    run();
    return () => timers.forEach(clearTimeout);
  }, [playing]);

  const view = reduced ? LAST_STEP : step;
  const applied = view >= 5;
  const received = view >= 6;
  const propertyStatus: PaymentStatusVariant = received ? 'received' : applied ? 'sent' : 'pending';

  return (
    <section ref={sectionRef} className="mx-auto max-w-5xl px-4 pb-14">
      <h2 className="text-heading-1 text-center">Veja o Alugasim em ação</h2>
      <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-center text-sm">
        Do reajuste ao recebimento, no mesmo painel. Dados fictícios.
      </p>

      <div
        role="img"
        aria-label="Demonstração animada: o painel mostra um reajuste disponível, calcula o novo aluguel com o índice oficial, envia a cobrança e registra o pagamento recebido."
        className="bg-surface shadow-elevated mx-auto mt-8 max-w-3xl overflow-hidden rounded-xl border border-neutral-300"
      >
        <div className="flex items-center gap-1.5 border-b border-neutral-300 bg-neutral-100 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-neutral-300" />
          <span className="size-2.5 rounded-full bg-neutral-300" />
          <span className="size-2.5 rounded-full bg-neutral-300" />
          <span className="text-caption ml-3 text-neutral-500">Alugasim</span>
        </div>

        <div
          ref={bodyRef}
          inert
          className="relative h-[27rem] overflow-hidden p-4 sm:h-[29rem] sm:p-6"
        >
          <div className="space-y-4">
            <div className="hidden gap-4 sm:grid sm:grid-cols-2">
              <FinancialSummaryCard
                label="Recebido"
                value={received ? NEW_RENT : 0}
                period="Este mês"
                icon={Wallet}
                tone="success"
              />
              <FinancialSummaryCard
                label="Pendente"
                value={received ? 0 : applied ? NEW_RENT : RENT}
                period="Este mês"
                icon={Clock3}
                tone="warning"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <PropertyCard
                  href="#"
                  label="Apto 302"
                  address="Florianópolis/SC"
                  tenantName="Carlos Mendes"
                  rentValue={applied ? NEW_RENT : RENT}
                  status={propertyStatus}
                  statusLabel={STATUS_LABEL_PT[propertyStatus]}
                />
              </div>
              <Button ref={applyRef} disabled={applied}>
                Aplicar reajuste
              </Button>
            </div>

            {applied && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <PaymentCard
                  propertyLabel="Apto 302"
                  tenantName="Carlos Mendes"
                  amount={NEW_RENT}
                  dueDate={DUE_DATE}
                  status={received ? 'received' : 'sent'}
                />
              </div>
            )}
          </div>

          {view >= 2 && view <= 4 && (
            <div className="animate-in fade-in absolute inset-0 z-10 flex items-center justify-center bg-neutral-950/30 p-4 duration-200">
              <div className="animate-in zoom-in-95 shadow-elevated grid w-full max-w-md gap-5 rounded-xl border border-neutral-300 bg-white p-6 text-sm duration-200">
                <div className="space-y-1">
                  <p className="font-heading text-base font-medium">Aplicar reajuste</p>
                  <p className="text-neutral-700">Confira os valores antes de confirmar.</p>
                </div>
                {view >= 3 ? (
                  <AdjustmentPreview
                    index="IGPM"
                    ratePercent={RATE}
                    previousValue={RENT}
                    newValue={NEW_RENT}
                  />
                ) : (
                  <p className="text-neutral-700">Calculando...</p>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button ref={confirmRef} disabled={view < 3}>
                    Confirmar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {view === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 shadow-elevated absolute right-4 bottom-4 z-20 flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm">
              <CircleCheck className="text-success-700 size-4" aria-hidden="true" />
              Reajuste aplicado
            </div>
          )}

          <MousePointer2
            aria-hidden="true"
            className={cn(
              'text-brand-900 pointer-events-none absolute top-0 left-0 z-30 size-5 fill-white drop-shadow transition-[transform,opacity,scale] duration-700 ease-in-out',
              cursor && !reduced ? 'opacity-100' : 'opacity-0',
              (view === 2 || view === 5) && 'scale-90',
            )}
            style={{ transform: `translate(${cursor?.x ?? 0}px, ${cursor?.y ?? 0}px)` }}
          />
        </div>
      </div>

      <ol className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
        {CAPTIONS.map(({ title, text, steps }, i) => (
          <li
            key={title}
            className={cn(
              'space-y-1 rounded-lg border p-3 transition-colors',
              steps.includes(view) ? 'border-brand-700 bg-white' : 'border-neutral-300',
            )}
          >
            <p className="text-caption text-neutral-500">Passo {i + 1}</p>
            <p className="font-heading text-sm font-medium">{title}</p>
            <p className="text-sm text-neutral-700">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
