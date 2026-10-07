import type { Metadata } from 'next';
import CheckoutView from '@/components/checkout/CheckoutView';
import PageHeading, { Accent } from '@/components/ui/PageHeading';

export const metadata: Metadata = { title: 'Finalizar compra' };

export default function CheckoutPage() {
  return (
    <section className="pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto min-h-[70vh]">
      <PageHeading
        className="mb-10 md:mb-12"
        eyebrow="Checkout"
        title={
          <>
            Finalizar <Accent>compra.</Accent>
          </>
        }
      />
      <CheckoutView />
    </section>
  );
}
