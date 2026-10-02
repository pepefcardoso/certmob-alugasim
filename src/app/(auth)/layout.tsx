import Link from 'next/link';
import { BrandLockup } from '@/components/brand-lockup';
import { Footer } from '@/components/footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
        <Link href="/" aria-label="Voltar para a página inicial">
          <BrandLockup className="text-center" />
        </Link>
        <div className="w-full max-w-sm">{children}</div>
      </div>
      <Footer />
    </>
  );
}