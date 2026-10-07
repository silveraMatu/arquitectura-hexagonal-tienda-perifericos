'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import type { CheckoutResponse } from '@/types/api';

/** Successful checkout: what was bought (from the POST /cart/checkout response, not the cart). */
const PurchaseSummary: React.FC<{ result: CheckoutResponse }> = ({ result }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // The confirm button that had focus is gone: move focus to the result.
  useEffect(() => headingRef.current?.focus({ preventScroll: true }), []);

  const units = result.purchasedItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="bg-card-gradient border border-accent/30 rounded-[20px] p-6 md:p-10 max-w-3xl mx-auto orchid-glow">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-accent-dim text-white flex items-center justify-center mb-5" aria-hidden="true">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-2xl md:text-3xl text-text-primary mb-2 focus:outline-none"
          style={{ fontWeight: 800 }}
        >
          ¡Compra confirmada!
        </h2>
        <p className="text-[15px] text-text-secondary" role="status">
          Compraste {units} {units === 1 ? 'unidad' : 'unidades'}. Tu carrito quedó vacío.
        </p>
      </div>

      <ul className="divide-y divide-white/10 border-y border-white/10" aria-label="Productos comprados">
        {result.purchasedItems.map((item) => (
          <li key={item.productId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-4">
            <div className="min-w-0">
              <p className="text-text-primary font-semibold">{item.productName}</p>
              <p className="text-[13px] text-text-secondary">
                {item.quantity} × {formatPrice(item.unitPrice)}
              </p>
            </div>
            <p className="font-display text-surface-card" style={{ fontWeight: 700 }}>
              {formatPrice(item.subtotal)}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-baseline gap-4 pt-5">
        <span className="text-[11px] uppercase tracking-widest text-text-secondary font-semibold">Total pagado</span>
        <span className="font-display text-[28px] text-text-primary" style={{ fontWeight: 800 }}>
          {formatPrice(result.total)}
        </span>
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/" className="btn-unbox py-3.5 px-7 text-[12px]">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
};

export default PurchaseSummary;
