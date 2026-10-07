'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AddToCartButton from '@/components/catalog/AddToCartButton';
import QuantitySelector, { parseQuantity } from '@/components/ui/QuantitySelector';
import StatusMessage from '@/components/ui/StatusMessage';
import { useCart } from '@/hooks/useCart';
import { useHydrated } from '@/hooks/useHydrated';
import { useProduct } from '@/hooks/useProducts';
import { getErrorMessage, hasErrorCode } from '@/lib/errors';
import { formatPrice } from '@/lib/format';
import { LOW_STOCK_THRESHOLD } from '@/lib/stock';

const BackLink: React.FC = () => (
  <Link
    href="/#products"
    className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors mb-8"
  >
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
    </svg>
    Volver al catálogo
  </Link>
);

const ProductDetail: React.FC<{ id: string }> = ({ id }) => {
  const hydrated = useHydrated();
  const { data: product, isPending, isError, error, refetch, isFetching } = useProduct(id);
  const { data: cart } = useCart();
  const [rawQuantity, setRawQuantity] = useState('1');

  if (!hydrated || isPending) {
    return (
      <>
        <BackLink />
        <p role="status" className="sr-only">Cargando producto…</p>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12" aria-hidden="true">
          <div className="min-h-[320px] md:min-h-[480px] rounded-[20px] border border-white/10 bg-surface-dark animate-pulse motion-reduce:animate-none" />
          <div className="space-y-4 py-2">
            <div className="h-12 w-3/4 rounded-xl bg-surface-dark animate-pulse motion-reduce:animate-none" />
            <div className="h-20 rounded-xl bg-surface-dark animate-pulse motion-reduce:animate-none" />
            <div className="h-10 w-1/3 rounded-xl bg-surface-dark animate-pulse motion-reduce:animate-none" />
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <BackLink />
        {hasErrorCode(error, 'PRODUCT_NOT_FOUND') ? (
          <StatusMessage
            tone="empty"
            title="Producto no encontrado"
            description="El producto que buscás no existe o ya no está disponible."
            action={
              <Link href="/" className="btn-unbox">
                Ver catálogo
              </Link>
            }
          />
        ) : (
          <StatusMessage
            tone="error"
            title="No pudimos cargar el producto"
            description={getErrorMessage(error)}
            action={
              <button type="button" className="btn-unbox" onClick={() => refetch()} disabled={isFetching}>
                {isFetching ? 'Reintentando…' : 'Reintentar'}
              </button>
            }
          />
        )}
      </>
    );
  }

  const inCart = cart?.items.find((item) => item.productId === product.id)?.quantity ?? 0;
  // The API rejects going over stock counting what's already in the cart, so cap the selector there.
  const maxAddable = Math.max(0, product.stock - inCart);
  const { quantity, error: quantityError } = parseQuantity(rawQuantity, maxAddable);

  const stockLabel =
    product.stock <= 0
      ? 'Sin stock'
      : product.stock <= LOW_STOCK_THRESHOLD
        ? `Últimas ${product.stock} unidades`
        : `${product.stock} unidades disponibles`;

  return (
    <>
      <BackLink />
      {/* Mobile (< 768px): visual panel, then info. md+: two columns. */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Visual panel (no product images in the API) */}
        <div className="relative min-h-[280px] md:min-h-[480px] rounded-[20px] border border-white/10 bg-card-gradient overflow-hidden" aria-hidden="true">
          <div className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 rounded-full bg-accent/25 blur-3xl" />
          <div className="absolute -bottom-1/3 -left-1/4 w-2/3 h-2/3 rounded-full bg-accent-dim/20 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1625] via-transparent to-transparent" />
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-text-secondary font-semibold mb-4">Detalle del producto</p>
          <h1 className="font-display text-[clamp(2rem,4vw,3.25rem)] text-text-primary leading-[1.05] tracking-tight mb-5" style={{ fontWeight: 800 }}>
            {product.name}
          </h1>
          <p className="text-[16px] text-text-secondary leading-relaxed mb-8 max-w-prose">{product.description}</p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span
              className="font-display text-[32px] px-3 py-1 rounded-xl"
              style={{ color: 'var(--surface-card)', fontWeight: 800, background: 'rgba(155, 89, 240, 0.12)' }}
            >
              {formatPrice(product.price)}
            </span>
            <span
              className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${
                product.stock <= LOW_STOCK_THRESHOLD ? 'bg-accent-dim text-white' : 'bg-white/[0.06] border border-white/10 text-text-secondary'
              }`}
            >
              {stockLabel}
            </span>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-5 space-y-5">
            {inCart > 0 && (
              <p className="text-[14px] text-text-secondary">
                Ya tenés <strong className="text-text-primary">{inCart}</strong> en el carrito.{' '}
                <Link href="/cart" className="text-surface-card underline underline-offset-4 hover:text-text-primary">
                  Ver carrito
                </Link>
              </p>
            )}

            {product.stock > 0 && maxAddable === 0 ? (
              <p className="text-[14px] text-text-primary">Ya tenés en el carrito todo el stock disponible de este producto.</p>
            ) : (
              <div className="flex flex-wrap items-end gap-4">
                <QuantitySelector
                  label="Cantidad"
                  value={rawQuantity}
                  onChange={setRawQuantity}
                  max={Math.max(1, maxAddable)}
                  error={product.stock > 0 ? quantityError : null}
                  disabled={product.stock <= 0}
                />
                <AddToCartButton
                  product={product}
                  quantity={quantity ?? 1}
                  disabled={quantity === null}
                  align="start"
                  onAdded={() => setRawQuantity('1')}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
