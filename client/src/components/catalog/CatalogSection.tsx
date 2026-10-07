'use client';

import React, { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import BentoProductGrid, { BentoGridSkeleton } from './BentoProductGrid';
import ProductFilters from './ProductFilters';
import PageHeading, { Accent } from '@/components/ui/PageHeading';
import StatusMessage from '@/components/ui/StatusMessage';
import { useHydrated } from '@/hooks/useHydrated';
import { useProducts } from '@/hooks/useProducts';
import { useReveal } from '@/hooks/useReveal';
import { getErrorMessage } from '@/lib/errors';
import type { ProductFilters as Filters } from '@/types/api';

// URL params mirror the API's query params, so a filtered catalog is shareable and survives reloads.
const PARAM = { q: 'q', minPrice: 'min_price', maxPrice: 'max_price' } as const;

const readPrice = (raw: string | null): number | undefined => {
  if (raw === null || raw.trim() === '') return undefined;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : undefined;
};

const readFilters = (params: URLSearchParams): Filters => ({
  q: params.get(PARAM.q)?.trim() || undefined,
  minPrice: readPrice(params.get(PARAM.minPrice)),
  maxPrice: readPrice(params.get(PARAM.maxPrice)),
});

/** Section header copied from the template's BentoProductGrid (copy in Spanish). */
export const CatalogHeader: React.FC = () => (
  <PageHeading
    as="h2"
    id="catalog-title"
    className="reveal mb-12"
    eyebrow="El arsenal · Catálogo 2026"
    title={
      <>
        Precisión.<br />
        <Accent>Control.</Accent><br />
        Velocidad.
      </>
    }
    aside="Todo lo que ves sale directo de nuestro stock: precios y unidades disponibles en tiempo real."
  />
);

const CatalogSection: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = readFilters(searchParams);
  const { data: products, isPending, isError, error, refetch, isFetching } = useProducts(filters);
  const hydrated = useHydrated();
  const sectionRef = useReveal<HTMLElement>();

  const hasActiveFilters = filters.q !== undefined || filters.minPrice !== undefined || filters.maxPrice !== undefined;

  const applyFilters = useCallback(
    (next: Filters) => {
      const params = new URLSearchParams();
      if (next.q) params.set(PARAM.q, next.q);
      if (next.minPrice !== undefined) params.set(PARAM.minPrice, String(next.minPrice));
      if (next.maxPrice !== undefined) params.set(PARAM.maxPrice, String(next.maxPrice));
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}#products` : `${pathname}#products`, { scroll: false });
    },
    [pathname, router],
  );

  const clearFilters = useCallback(() => applyFilters({}), [applyFilters]);

  let content: React.ReactNode;
  if (!hydrated || isPending) {
    content = (
      <>
        <p role="status" className="sr-only">Cargando productos…</p>
        <BentoGridSkeleton />
      </>
    );
  } else if (isError) {
    content = (
      <StatusMessage
        tone="error"
        title="No pudimos cargar los productos"
        description={getErrorMessage(error)}
        action={
          <button type="button" className="btn-unbox" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? 'Reintentando…' : 'Reintentar'}
          </button>
        }
      />
    );
  } else if (products.length === 0) {
    content = hasActiveFilters ? (
      <StatusMessage
        tone="empty"
        title="No encontramos productos"
        description="Ningún producto coincide con la búsqueda o el rango de precios. Probá con otros filtros."
        action={
          <button type="button" className="btn-unbox" onClick={clearFilters}>
            Limpiar filtros
          </button>
        }
      />
    ) : (
      <StatusMessage tone="empty" title="Todavía no hay productos" description="El catálogo está vacío por ahora." />
    );
  } else {
    content = (
      <>
        <p className="text-[12px] uppercase tracking-widest text-text-secondary font-semibold mb-4 pl-1" role="status">
          {products.length} {products.length === 1 ? 'producto' : 'productos'}
          {hasActiveFilters ? ' encontrados' : ''}
        </p>
        <BentoProductGrid products={products} />
      </>
    );
  }

  return (
    <section
      id="products"
      ref={sectionRef}
      className="py-24 md:py-32 px-6 md:px-10 max-w-7xl mx-auto scroll-mt-20"
      aria-labelledby="catalog-title"
    >
      <CatalogHeader />
      {/* key: remount the form so its inputs follow the URL (back/forward, "Limpiar"). */}
      <ProductFilters key={searchParams.toString()} value={filters} onApply={applyFilters} onClear={clearFilters} />
      {content}
    </section>
  );
};

export default CatalogSection;
