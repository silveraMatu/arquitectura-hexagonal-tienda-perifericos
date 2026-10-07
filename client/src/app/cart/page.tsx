import type { Metadata } from 'next';
import CartView from '@/components/cart/CartView';
import PageHeading, { Accent } from '@/components/ui/PageHeading';

export const metadata: Metadata = { title: 'Carrito' };

export default function CartPage() {
  return (
    <section className="pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto min-h-[70vh]">
      <PageHeading
        className="mb-10 md:mb-12"
        eyebrow="Tu selección"
        title={
          <>
            Tu <Accent>carrito.</Accent>
          </>
        }
        aside="Si agregás un producto que ya estaba, se suma a su línea. Podés deshacer la última adición o quitar una línea entera."
      />
      <CartView />
    </section>
  );
}
