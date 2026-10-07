'use client';

import React from 'react';
import { useHydrated } from '@/hooks/useHydrated';
import { useProducts } from '@/hooks/useProducts';
import { formatPrice } from '@/lib/format';

/** Hero stats strip — the template's invented figures replaced by real numbers from GET /products. */
const HeroStats: React.FC = () => {
  const { data } = useProducts();
  // Until hydration ends, render the same placeholders as the server.
  const products = useHydrated() ? data : undefined;

  const stats = [
    { label: 'Productos en catálogo', value: products ? String(products.length) : '—' },
    {
      label: 'Unidades en stock',
      value: products ? String(products.reduce((sum, p) => sum + p.stock, 0)) : '—',
    },
    {
      label: 'Precio desde',
      value: products && products.length > 0 ? formatPrice(Math.min(...products.map((p) => p.price))) : '—',
    },
  ];

  return (
    <dl className="mt-10 md:mt-14 grid grid-cols-3 gap-4 md:flex md:gap-14 border-t border-white/[0.08] pt-6 md:pt-8" aria-busy={!products}>
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col-reverse justify-end gap-1">
          <dt className="text-[10px] md:text-[11px] uppercase tracking-wider md:tracking-widest text-text-secondary font-medium leading-snug">{stat.label}</dt>
          <dd className="text-[18px] md:text-[22px] font-display text-text-primary" style={{ fontWeight: 800 }}>
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default HeroStats;
