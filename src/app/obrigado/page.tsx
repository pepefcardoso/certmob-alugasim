import { BrandLockup } from '@/components/brand-lockup';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ScheduleDemoButton } from '@/components/landing/schedule-demo-button';
import { WHATSAPP_BUSINESS_NUMBER } from '@/components/landing/constants';

export default function ObrigadoPage() {
  return (
    <>
      <div className="mx-auto max-w-xl space-y-8 p-6 text-center">
        <BrandLockup className="text-left" />

        <div className="space-y-2">
          <h1 className="text-heading-1">Recebemos seus dados</h1>
          <p className="text-muted-foreground">
            Nosso time vai te chamar no WhatsApp para configurar seus contratos e travar o preço de
            fundador. Enquanto isso:
          </p>
        </div>

        {/* TODO: substituir por vídeo real do fundador (public/video/founder-intro.mp4) */}
        <div className="bg-muted flex aspect-video items-center justify-center rounded-xl border border-dashed">
          <p className="text-muted-foreground text-sm">Vídeo do fundador — adicionar asset</p>
        </div>

        <div className="space-y-3">
          <Button asChild size="lg" className="w-full bg-[#25D366] hover:bg-[#1fb855]">
            <a
              href={`https://wa.me/55${WHATSAPP_BUSINESS_NUMBER}`}
              target="_blank"
              rel="noreferrer"
            >
              Fale conosco no WhatsApp agora
            </a>
          </Button>
          <ScheduleDemoButton />
        </div>
      </div>
      <Footer />
    </>
  );
}
