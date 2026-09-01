'use client';

import { useEffect, useState } from 'react';
import type { AdjustmentIndex } from '@/generated/prisma/client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FALLBACK_RATES, INDEX_LABELS, LEAD_CTA_LABEL } from '@/components/landing/constants';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function RentAdjustmentCalculator() {
  const [rates, setRates] = useState<Record<AdjustmentIndex, number>>(FALLBACK_RATES);
  const [index, setIndex] = useState<AdjustmentIndex>('IGPM');
  const [currentRent, setCurrentRent] = useState(2000);

  useEffect(() => {
    let active = true;
    fetch('/api/public/rent-index')
      .then((res) => res.json())
      .then((data: Record<AdjustmentIndex, number>) => {
        if (active) setRates(data);
      })
      .catch(() => {
        // Keep the client-side fallback — the calculator must never break pre-launch.
      });
    return () => {
      active = false;
    };
  }, []);

  const rate = rates[index];
  const newRent = currentRent * (1 + rate / 100);
  const monthlyGain = newRent - currentRent;
  const annualLoss = monthlyGain * 12;

  return (
    <Card className="border-primary/10 shadow-sm">
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="current-rent">Aluguel atual</Label>
            <div className="relative">
              <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm">
                R$
              </span>
              <Input
                id="current-rent"
                type="number"
                min={0}
                inputMode="decimal"
                className="pl-9"
                value={currentRent}
                onChange={(event) => setCurrentRent(Number(event.target.value) || 0)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="index-select">Índice do contrato</Label>
            <Select value={index} onValueChange={(value) => setIndex(value as AdjustmentIndex)}>
              <SelectTrigger id="index-select" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(INDEX_LABELS) as AdjustmentIndex[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {INDEX_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="font-heading text-lg font-medium tracking-tight sm:text-xl">
            {currency.format(currentRent)}
            <span className="text-muted-foreground"> + (</span>
            {INDEX_LABELS[index]}{' '}
            <span className="text-warning-700">{rate.toFixed(2)}%</span>
            <span className="text-muted-foreground">) = </span>
            <span className="text-warning-700">{currency.format(newRent)}</span>
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Sem esse reajuste, você deixa de ganhar{' '}
            <span className="text-warning-700 font-medium">
              {currency.format(annualLoss)}
            </span>{' '}
            neste imóvel em 12 meses.
          </p>
        </div>

        <Button asChild size="lg" className="w-full">
          <a href="#lead-magnet">{LEAD_CTA_LABEL}</a>
        </Button>
      </CardContent>
    </Card>
  );
}
