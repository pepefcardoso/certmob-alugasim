import type { Metadata } from 'next';
import { SiteNav } from '@/components/landing/site-nav';
import { Hero } from '@/components/landing/hero';
import { PainCards } from '@/components/landing/pain-cards';
import { HowItWorks } from '@/components/landing/how-it-works';
import { FeatureBenefits } from '@/components/landing/feature-benefits';
import { TrustSection } from '@/components/landing/trust-section';
import { Pricing } from '@/components/landing/pricing';
import { Faq } from '@/components/landing/faq';
import { LeadCaptureSection } from '@/components/landing/lead-capture-section';

export const metadata: Metadata = {
  title: 'RentEasy — Reajuste de aluguel automático',
  description:
    'Alugo ajuda a registrar contrato. RentEasy avisa quando você está perdendo dinheiro no aluguel — e resolve sozinho.',
};

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <PainCards />
        <HowItWorks />
        <FeatureBenefits />
        <TrustSection />
        <Pricing />
        <Faq />
        <LeadCaptureSection />
      </main>
    </>
  );
}
