import { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import CatalogSection, { CatalogHeader } from '@/components/catalog/CatalogSection';
import { BentoGridSkeleton } from '@/components/catalog/BentoProductGrid';

// Catalog filters live in the URL (useSearchParams), so the client part renders under Suspense
// and the rest of the page can still be prerendered.
const CatalogFallback = () => (
  <section className="py-24 md:py-32 px-6 md:px-10 max-w-7xl mx-auto" aria-busy="true">
    <CatalogHeader />
    <BentoGridSkeleton />
  </section>
);

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<CatalogFallback />}>
        <CatalogSection />
      </Suspense>
    </>
  );
}
