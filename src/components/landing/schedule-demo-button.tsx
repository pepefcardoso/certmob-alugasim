'use client';

import { useEffect } from 'react';
import { getCalApi } from '@calcom/embed-react';
import { Button } from '@/components/ui/button';
import { CALCOM_LINK } from '@/components/landing/constants';

export function ScheduleDemoButton() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    })();
  }, []);

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full"
      data-cal-link={CALCOM_LINK}
      data-cal-config='{"layout":"month_view"}'
    >
      Agendar uma demo rápida
    </Button>
  );
}
