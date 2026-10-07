import React from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import type { CartItem } from '@/types/api';

interface CartLineProps {
  item: CartItem;
  /** Omit the actions to render a read-only line (checkout review). */
  actions?: {
    onAddOne: () => void;
    onRemove: () => void;
    /** Any cart mutation in flight: actions are paused so they apply in order. */
    busy: boolean;
    pending: 'add' | 'remove' | null;
  };
}

/** One cart line. Prices are the API snapshot (unitPrice/subtotal) and are never recalculated here. */
const CartLine: React.FC<CartLineProps> = ({ item, actions }) => (
  <li className="bg-card-gradient border border-white/10 rounded-[20px] p-5 md:p-6">
    {/* Mobile (< 768px): info, then amounts + actions below. md+: one row. */}
    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-lg md:text-xl text-text-primary leading-tight" style={{ fontWeight: 800 }}>
          <Link href={`/products/${encodeURIComponent(item.productId)}`} className="hover:text-surface-card transition-colors">
            {item.productName}
          </Link>
        </h3>
        <p className="text-[14px] text-text-secondary mt-1">
          {formatPrice(item.unitPrice)} c/u · {item.quantity} {item.quantity === 1 ? 'unidad' : 'unidades'}
        </p>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6">
        <div className="text-left md:text-right">
          <p className="text-[11px] uppercase tracking-widest text-text-secondary font-semibold">Subtotal</p>
          <p className="font-display text-[18px] text-surface-card" style={{ fontWeight: 700 }}>
            {formatPrice(item.subtotal)}
          </p>
        </div>

        {actions && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-ghost px-4"
              onClick={actions.onAddOne}
              disabled={actions.busy}
              aria-busy={actions.pending === 'add'}
            >
              {actions.pending === 'add' ? 'Sumando…' : '+1'}
              <span className="sr-only"> unidad de {item.productName}</span>
            </button>
            <button
              type="button"
              className="btn-ghost px-4"
              onClick={actions.onRemove}
              disabled={actions.busy}
              aria-busy={actions.pending === 'remove'}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.87 12.14A2 2 0 0116.14 21H7.86a2 2 0 01-1.99-1.86L5 7m5 4v6m4-6v6M4 7h16M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
              </svg>
              {actions.pending === 'remove' ? 'Quitando…' : 'Quitar'}
              <span className="sr-only"> {item.productName} del carrito</span>
            </button>
          </div>
        )}
      </div>
    </div>
  </li>
);

/** Placeholder lines while the cart loads. */
export const CartLinesSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <ul className="space-y-3" aria-hidden="true">
    {Array.from({ length: count }, (_, index) => (
      <li key={index} className="h-[104px] rounded-[20px] border border-white/10 bg-surface-dark animate-pulse motion-reduce:animate-none" />
    ))}
  </ul>
);

export default CartLine;
