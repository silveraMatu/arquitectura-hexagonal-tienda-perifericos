'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CartLine, { CartLinesSkeleton } from './CartLine';
import CartSummary from './CartSummary';
import Alert from '@/components/ui/Alert';
import StatusMessage from '@/components/ui/StatusMessage';
import { useAddToCart, useCart, useRemoveCartItem, useUndoLastAdd } from '@/hooks/useCart';
import { useHydrated } from '@/hooks/useHydrated';
import { getErrorMessage, hasErrorCode } from '@/lib/errors';

const CartView: React.FC = () => {
  const hydrated = useHydrated();
  const { data: cart, isPending, isError, error, refetch, isFetching } = useCart();
  const addOne = useAddToCart();
  const remove = useRemoveCartItem();
  const undo = useUndoLastAdd();

  const [actionError, setActionError] = useState<unknown>(null);
  // The API doesn't expose the undo history: once it says there's nothing left, keep the button
  // off until something is added again from this page.
  const [nothingToUndo, setNothingToUndo] = useState(false);

  const busy = addOne.isPending || remove.isPending || undo.isPending;

  const callbacks = {
    onSuccess: () => setActionError(null),
    onError: (err: unknown) => setActionError(err),
  };

  const handleAddOne = (productId: string) =>
    addOne.mutate(
      { productId, quantity: 1 },
      { ...callbacks, onSuccess: () => { setActionError(null); setNothingToUndo(false); } },
    );

  const handleRemove = (productId: string) => remove.mutate(productId, callbacks);

  const handleUndo = () =>
    undo.mutate(undefined, {
      ...callbacks,
      onError: (err) => {
        setActionError(err);
        if (hasErrorCode(err, 'NO_ACTIONS_TO_UNDO')) setNothingToUndo(true);
      },
    });

  if (!hydrated || isPending) {
    return (
      <div className="grid lg:grid-cols-12 gap-6">
        <p role="status" className="sr-only">Cargando tu carrito…</p>
        <div className="lg:col-span-8">
          <CartLinesSkeleton />
        </div>
        <div className="lg:col-span-4 h-[280px] rounded-[20px] border border-white/10 bg-surface-dark animate-pulse motion-reduce:animate-none" aria-hidden="true" />
      </div>
    );
  }

  if (isError) {
    return (
      <StatusMessage
        tone="error"
        title="No pudimos cargar tu carrito"
        description={getErrorMessage(error)}
        action={
          <button type="button" className="btn-unbox" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? 'Reintentando…' : 'Reintentar'}
          </button>
        }
      />
    );
  }

  if (cart.isEmpty) {
    return (
      <StatusMessage
        tone="empty"
        title="Tu carrito está vacío"
        description="Todavía no agregaste productos. Recorré el catálogo y sumá lo que necesites."
        action={
          <Link href="/" className="btn-unbox">
            Ver catálogo
          </Link>
        }
      />
    );
  }

  const units = cart.items.reduce((count, item) => count + item.quantity, 0);

  return (
    // Mobile / tablet (< 1024px): lines, then summary. lg+: lines (8 cols) + sticky summary (4 cols).
    <div className="grid lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 space-y-4">
        {actionError !== null && <Alert>{getErrorMessage(actionError)}</Alert>}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12px] uppercase tracking-widest text-text-secondary font-semibold pl-1" role="status">
            {units} {units === 1 ? 'unidad' : 'unidades'} en tu carrito
          </p>
          <button
            type="button"
            className="btn-ghost"
            onClick={handleUndo}
            disabled={busy || nothingToUndo}
            aria-busy={undo.isPending}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 010 10h-3M3 10l4-4m-4 4l4 4" />
            </svg>
            {undo.isPending ? 'Deshaciendo…' : 'Deshacer última adición'}
          </button>
        </div>

        <ul className="space-y-3" aria-label="Productos en el carrito">
          {cart.items.map((item) => (
            <CartLine
              key={item.productId}
              item={item}
              actions={{
                onAddOne: () => handleAddOne(item.productId),
                onRemove: () => handleRemove(item.productId),
                busy,
                pending:
                  addOne.isPending && addOne.variables?.productId === item.productId
                    ? 'add'
                    : remove.isPending && remove.variables === item.productId
                      ? 'remove'
                      : null,
              }}
            />
          ))}
        </ul>
      </div>

      <div className="lg:col-span-4">
        <CartSummary cart={cart}>
          <Link href="/checkout" className="btn-unbox w-full justify-center py-3.5 text-[12px]">
            Finalizar compra
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link href="/" className="btn-ghost w-full mt-3">
            Seguir comprando
          </Link>
        </CartSummary>
      </div>
    </div>
  );
};

export default CartView;
