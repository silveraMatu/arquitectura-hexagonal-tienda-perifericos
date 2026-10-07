'use client';

import React from 'react';
import Link from 'next/link';
import PurchaseSummary from './PurchaseSummary';
import CartLine, { CartLinesSkeleton } from '@/components/cart/CartLine';
import CartSummary from '@/components/cart/CartSummary';
import Alert from '@/components/ui/Alert';
import StatusMessage from '@/components/ui/StatusMessage';
import { useCart, useCheckout } from '@/hooks/useCart';
import { useHydrated } from '@/hooks/useHydrated';
import { getErrorMessage, hasErrorCode } from '@/lib/errors';

const CHECKOUT_MESSAGES = {
  INSUFFICIENT_STOCK:
    'Algún producto ya no tiene stock suficiente. No se descontó nada: revisá las cantidades en tu carrito.',
  EMPTY_CART: 'Tu carrito está vacío: no hay nada para comprar.',
  PRODUCT_NOT_FOUND: 'Algún producto de tu carrito ya no existe. Quitalo del carrito y volvé a intentar.',
};

const CheckoutView: React.FC = () => {
  const hydrated = useHydrated();
  const { data: cart, isPending, isError, error, refetch, isFetching } = useCart();
  const checkout = useCheckout();

  // Rendered from the mutation result, so it stays after the cart is refetched empty.
  if (checkout.isSuccess) return <PurchaseSummary result={checkout.data} />;

  if (!hydrated || isPending) {
    return (
      <div className="grid lg:grid-cols-12 gap-6">
        <p role="status" className="sr-only">Cargando tu compra…</p>
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
        title="No pudimos cargar tu compra"
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
        title="No hay nada para comprar"
        description="Tu carrito está vacío. Agregá productos desde el catálogo para finalizar una compra."
        action={
          <Link href="/" className="btn-unbox">
            Ver catálogo
          </Link>
        }
      />
    );
  }

  const checkoutError = checkout.isError ? checkout.error : null;
  const linkToCart =
    hasErrorCode(checkoutError, 'INSUFFICIENT_STOCK') || hasErrorCode(checkoutError, 'PRODUCT_NOT_FOUND');

  return (
    // Mobile / tablet (< 1024px): review, then summary. lg+: review (8 cols) + sticky summary (4 cols).
    <div className="grid lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 space-y-4">
        {checkoutError !== null && (
          <Alert
            action={
              linkToCart ? (
                <Link href="/cart" className="btn-ghost">
                  Revisar carrito
                </Link>
              ) : undefined
            }
          >
            {getErrorMessage(checkoutError, CHECKOUT_MESSAGES)}
          </Alert>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[12px] uppercase tracking-widest text-text-secondary font-semibold pl-1">
            Revisá tu pedido
          </h2>
          <Link href="/cart" className="text-[12px] font-semibold uppercase tracking-widest text-surface-card hover:text-text-primary transition-colors">
            Editar carrito
          </Link>
        </div>

        <ul className="space-y-3" aria-label="Productos a comprar">
          {cart.items.map((item) => (
            <CartLine key={item.productId} item={item} />
          ))}
        </ul>
      </div>

      <div className="lg:col-span-4">
        <CartSummary cart={cart} title="Tu pedido">
          <button
            type="button"
            className="btn-unbox w-full justify-center py-3.5 text-[12px]"
            onClick={() => checkout.mutate()}
            disabled={cart.isEmpty || checkout.isPending}
            aria-busy={checkout.isPending}
          >
            {checkout.isPending ? 'Confirmando…' : 'Confirmar compra'}
          </button>
          <p className="text-[12px] text-text-secondary leading-relaxed mt-3">
            La compra es todo o nada: si falta stock de algún producto, no se descuenta ninguno.
          </p>
        </CartSummary>
      </div>
    </div>
  );
};

export default CheckoutView;
