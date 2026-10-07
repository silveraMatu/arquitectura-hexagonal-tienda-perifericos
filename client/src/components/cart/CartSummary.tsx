import React from 'react';
import { formatPrice } from '@/lib/format';
import type { CartResponse } from '@/types/api';

interface CartSummaryProps {
  cart: CartResponse;
  /** The main action (finalizar / confirmar compra). */
  children: React.ReactNode;
  title?: string;
}

/** Order summary card. The total is the API's `total`, never recomputed on the client. */
const CartSummary: React.FC<CartSummaryProps> = ({ cart, children, title = 'Resumen' }) => {
  const units = cart.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <aside
      aria-label={title}
      className="bg-card-gradient border border-white/10 rounded-[20px] p-6 lg:sticky lg:top-28"
    >
      <h2 className="font-display text-xl text-text-primary mb-5" style={{ fontWeight: 800 }}>
        {title}
      </h2>
      <dl className="space-y-3 text-[14px]">
        <div className="flex justify-between gap-4">
          <dt className="text-text-secondary">Productos</dt>
          <dd className="text-text-primary">{cart.items.length}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-secondary">Unidades</dt>
          <dd className="text-text-primary">{units}</dd>
        </div>
        <div className="flex justify-between items-baseline gap-4 border-t border-white/10 pt-4 mt-4">
          <dt className="text-[11px] uppercase tracking-widest text-text-secondary font-semibold">Total</dt>
          <dd className="font-display text-[28px] text-text-primary" style={{ fontWeight: 800 }}>
            {formatPrice(cart.total)}
          </dd>
        </div>
      </dl>
      <p className="text-[12px] text-text-secondary leading-relaxed mt-3">
        Los precios quedan fijos desde que agregaste cada producto.
      </p>
      <div className="mt-6">{children}</div>
    </aside>
  );
};

export default CartSummary;
