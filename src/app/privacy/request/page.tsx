import { requireSession } from '@/lib/auth';
import { Footer } from '@/components/footer';
import { PrivacyRequestForm } from './privacy-request-form';

export default async function PrivacyRequestPage() {
  await requireSession();

  return (
    <>
      <div className="mx-auto max-w-md space-y-4 p-6">
        <h1 className="text-heading-1">Solicitação de titular de dados</h1>
        <p className="text-body-sm text-neutral-700">
          Solicite acesso, correção, exclusão ou portabilidade dos seus dados pessoais.
          Responderemos em até 15 dias, conforme a LGPD (Art. 18).
        </p>
        <PrivacyRequestForm />
      </div>
      <Footer />
    </>
  );
}
