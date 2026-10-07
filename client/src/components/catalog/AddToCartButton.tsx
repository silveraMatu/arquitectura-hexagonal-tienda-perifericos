'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAddToCart } from '@/hooks/useCart';
import { getErrorMessage } from '@/lib/errors';
import type { Product } from '@/types/api';

interface AddToCartButtonProps {
  product: Pick<Product, 'id' | 'name' | 'stock'>;
  quantity?: number;
  className?: string;
  /** Where the error message sits relative to the button. */
  align?: 'start' | 'end';
  /** Extra condition from the parent, e.g. an invalid quantity. */
  disabled?: boolean;
  onAdded?: () => void;
}

const FEEDBACK_MS = 2000;

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  className = '',
  align = 'end',
  disabled: disabledByParent = false,
  onAdded,
}) => {
  const addToCart = useAddToCart();
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const outOfStock = product.stock <= 0;
  const disabled = outOfStock || addToCart.isPending || disabledByParent;

  const handleClick = () => {
    clearTimeout(timer.current);
    setJustAdded(false);
    addToCart.mutate(
      { productId: product.id, quantity },
      {
        onSuccess: () => {
          setJustAdded(true);
          timer.current = setTimeout(() => setJustAdded(false), FEEDBACK_MS);
          onAdded?.();
        },
      },
    );
  };

  const label = outOfStock
    ? 'Sin stock'
    : addToCart.isPending
      ? 'Agregando…'
      : justAdded
        ? '¡Agregado!'
        : 'Agregar al carrito';

  return (
    <div className={`relative z-10 flex flex-col gap-2 ${align === 'end' ? 'items-end' : 'items-start'} ${className}`}>
      {addToCart.isError && (
        <p
          role="alert"
          className={`max-w-[18rem] text-[12px] leading-snug text-text-primary bg-bg-primary/90 border border-accent/40 rounded-lg px-3 py-2 ${
            align === 'end' ? 'text-right' : 'text-left'
          }`}
        >
          {getErrorMessage(addToCart.error)}
        </p>
      )}
      <button
        type="button"
        className="btn-unbox text-[10px] px-4 py-2 whitespace-nowrap"
        onClick={handleClick}
        disabled={disabled}
        aria-busy={addToCart.isPending}
      >
        {label}
        <span className="sr-only">: {product.name}</span>
        {!outOfStock && !addToCart.isPending && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {justAdded ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            )}
          </svg>
        )}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {justAdded ? `${product.name} agregado al carrito` : ''}
      </span>
    </div>
  );
};

export default AddToCartButton;
