import type { Metadata } from 'next';
import Link from 'next/link';
import StatusMessage from '@/components/ui/StatusMessage';

export const metadata: Metadata = { title: 'Página no encontrada' };

export default function NotFound() {
  return (
    <section className="pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto min-h-[70vh]">
      <StatusMessage
        tone="empty"
        title="Página no encontrada"
        description="La página que buscás no existe o cambió de lugar."
        action={
          <Link href="/" className="btn-unbox">
            Ir a la tienda
          </Link>
        }
      />
    </section>
  );
}
