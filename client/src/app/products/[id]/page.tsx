import type { Metadata } from 'next';
import ProductDetail from '@/components/product/ProductDetail';

export const metadata: Metadata = { title: 'Producto' };

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <section className="pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto min-h-[70vh]">
      <ProductDetail id={id} />
    </section>
  );
}
