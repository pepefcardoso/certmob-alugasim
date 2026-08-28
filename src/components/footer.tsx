import Link from 'next/link';

export function Footer() {
  return (
    <footer className="text-muted-foreground mt-auto border-t px-6 py-4 text-sm">
      <div className="flex flex-wrap gap-4">
        <Link href="/privacy" className="hover:text-foreground">
          Política de Privacidade
        </Link>
        <Link href="/terms" className="hover:text-foreground">
          Termos de Uso
        </Link>
        <Link href="/privacy/request" className="hover:text-foreground">
          Meus dados (LGPD)
        </Link>
      </div>
    </footer>
  );
}
