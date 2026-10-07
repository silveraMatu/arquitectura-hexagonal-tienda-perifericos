'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import { useReveal } from '@/hooks/useReveal';
import { formatPrice } from '@/lib/format';
import { LOW_STOCK_THRESHOLD } from '@/lib/stock';
import type { Product } from '@/types/api';

// Base: template/home/components/BentoProductGrid.tsx, adapted to GET /products.
// The API has no image/rating/category/badge, so tiles use the template's card gradient and show
// what the API does provide: name, description, price and stock.

type TileSize = 'hero' | 'tall' | 'wide' | 'small' | 'full';

/**
 * Rows of the template's bento tiles, each adding up to the 12 columns (the template's own
 * medium + accent row only reached 10 and left a hole). A lone leftover tile spans the full row.
 */
const ROW_PATTERNS: [TileSize, TileSize][] = [
  ['hero', 'tall'],
  ['wide', 'small'],
  ['small', 'wide'],
];

const tileSizes = (count: number): TileSize[] => {
  const sizes: TileSize[] = [];
  for (let row = 0; sizes.length < count; row++) {
    if (count - sizes.length === 1) sizes.push('full');
    else sizes.push(...ROW_PATTERNS[row % ROW_PATTERNS.length]);
  }
  return sizes;
};

const stockBadge = (stock: number): string | null => {
  if (stock <= 0) return 'Sin stock';
  if (stock <= LOW_STOCK_THRESHOLD) return 'Últimas unidades';
  return null;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ProductCard: React.FC<{ product: Product; size: TileSize }> = ({ product, size }) => {
  const cardRef = useRef<HTMLLIElement>(null);
  const badge = stockBadge(product.stock);
  const isLarge = size === 'hero' || size === 'tall';

  const handleMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
    const card = cardRef.current;
    if (!card || prefersReducedMotion()) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <li
      ref={cardRef}
      className={`bento-tile bento-${size} group`}
      style={{ transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease, border-color 0.3s ease' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background (no product images in the API) */}
      <div className="absolute inset-0 bg-card-gradient" aria-hidden="true">
        <div className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 rounded-full bg-accent/20 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1625] via-[#1A1625]/30 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          {badge && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-accent-dim text-white">
              {badge}
            </span>
          )}
          {product.stock > 0 && (
            <span className="ml-auto bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
              {product.stock} en stock
            </span>
          )}
        </div>

        {/* Bottom content */}
        <div>
          <h3
            className={`font-display text-text-primary mb-2 leading-tight ${isLarge ? 'text-2xl md:text-3xl' : 'text-xl'}`}
            style={{ fontWeight: 800 }}
          >
            {/* Stretched link: the whole tile opens the detail; the button sits above it (z-10). */}
            <Link
              href={`/products/${encodeURIComponent(product.id)}`}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-[20px] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-accent focus-visible:after:[outline-offset:-2px]"
            >
              {product.name}
            </Link>
          </h3>
          <p className={`text-[14px] text-text-secondary leading-relaxed mb-4 ${isLarge ? 'line-clamp-3 max-w-md' : 'line-clamp-2'}`}>
            {product.description}
          </p>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <span
              className="text-[18px] font-display price-badge px-2.5 py-0.5 rounded-lg shrink-0"
              style={{ color: 'var(--surface-card)', fontWeight: 700, background: 'rgba(155, 89, 240, 0.12)' }}
            >
              {formatPrice(product.price)}
            </span>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </li>
  );
};

const BentoProductGrid: React.FC<{ products: Product[] }> = ({ products }) => {
  const gridRef = useReveal<HTMLUListElement>(products);
  const sizes = tileSizes(products.length);

  return (
    <ul ref={gridRef} className="stagger-children bento-grid" aria-label="Productos">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} size={sizes[index]} />
      ))}
    </ul>
  );
};

/** Loading placeholder with the same bento rhythm, so the layout doesn't jump. */
export const BentoGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="bento-grid" aria-hidden="true">
    {tileSizes(count).map((size, index) => (
      <div
        key={index}
        className={`bento-${size} rounded-[20px] border border-white/10 bg-surface-dark animate-pulse motion-reduce:animate-none`}
      />
    ))}
  </div>
);

export default BentoProductGrid;
