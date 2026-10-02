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
import { Footer } from '@/components/footer';
import { FitSection } from '@/components/landing/fit-section';
import { ProductDemo } from '@/components/landing/product-demo';

export const metadata: Metadata = {
  title: 'Alugasim: Reajuste de aluguel automático',
  description:
    'Alugasim calcula seu reajuste de aluguel com a taxa oficial, avisa na hora certa e organiza contratos, inquilinos e recebimentos num só lugar.',
};

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <PainCards />
        <FitSection />
        <HowItWorks />
        <ProductDemo />
        <FeatureBenefits />
        <TrustSection />
        <Pricing />
        <Faq />
        <LeadCaptureSection />
      </main>
      <Footer />
    </>
  );
}
