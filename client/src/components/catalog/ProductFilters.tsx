'use client';

import React, { useId, useState } from 'react';
import type { ProductFilters as Filters } from '@/types/api';

interface ProductFiltersProps {
  /** Filters currently applied (from the URL). The form remounts when they change. */
  value: Filters;
  onApply: (filters: Filters) => void;
  onClear: () => void;
}

const toInput = (value: number | undefined) => (value === undefined ? '' : String(value));

const parsePrice = (raw: string): number | undefined | 'invalid' => {
  const trimmed = raw.trim().replace(',', '.');
  if (trimmed === '') return undefined;
  const value = Number(trimmed);
  return Number.isFinite(value) && value >= 0 ? value : 'invalid';
};

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-[14px] text-text-primary placeholder:text-text-secondary/70 hover:border-white/20 focus-visible:border-accent transition-colors';

const labelClass = 'block text-[11px] uppercase tracking-widest text-text-secondary font-semibold mb-2 pl-1';

const ProductFilters: React.FC<ProductFiltersProps> = ({ value, onApply, onClear }) => {
  const id = useId();
  const [q, setQ] = useState(value.q ?? '');
  const [minPrice, setMinPrice] = useState(toInput(value.minPrice));
  const [maxPrice, setMaxPrice] = useState(toInput(value.maxPrice));
  const [error, setError] = useState<string | null>(null);

  const hasActiveFilters = Boolean(value.q) || value.minPrice !== undefined || value.maxPrice !== undefined;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const min = parsePrice(minPrice);
    const max = parsePrice(maxPrice);

    if (min === 'invalid' || max === 'invalid') {
      setError('Los precios tienen que ser números mayores o iguales a 0.');
      return;
    }
    if (min !== undefined && max !== undefined && min > max) {
      setError('El precio mínimo no puede ser mayor que el máximo.');
      return;
    }

    setError(null);
    onApply({ q: q.trim() || undefined, minPrice: min, maxPrice: max });
  };

  return (
    <form
      role="search"
      aria-label="Buscar productos"
      onSubmit={handleSubmit}
      noValidate
      className="bg-white/[0.03] border border-white/[0.08] rounded-[28px] p-4 md:p-5 mb-8"
    >
      {/* Mobile (< 768px): search full width, prices side by side, buttons full width. md+: one row. */}
      <div className="grid grid-cols-2 md:grid-cols-[minmax(0,1fr)_10rem_10rem_auto] gap-3 md:gap-4 items-end">
        <div className="col-span-2 md:col-span-1">
          <label htmlFor={`${id}-q`} className={labelClass}>
            Buscar por nombre
          </label>
          <input
            id={`${id}-q`}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Mouse, teclado, monitor…"
            className={inputClass}
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor={`${id}-min`} className={labelClass}>
            Precio mín.
          </label>
          <input
            id={`${id}-min`}
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            className={inputClass}
            aria-invalid={error !== null}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        </div>

        <div>
          <label htmlFor={`${id}-max`} className={labelClass}>
            Precio máx.
          </label>
          <input
            id={`${id}-max`}
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Sin límite"
            className={inputClass}
            aria-invalid={error !== null}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        </div>

        <div className="col-span-2 md:col-span-1 flex gap-3">
          <button type="submit" className="btn-unbox flex-1 md:flex-none justify-center px-6 py-3.5">
            Buscar
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClear}
              className="flex-1 md:flex-none inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/20 text-[11px] font-bold uppercase tracking-widest text-text-primary hover:bg-white/[0.08] hover:border-white/30 transition-all duration-200"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-3 pl-1 text-[13px] text-text-primary">
          {error}
        </p>
      )}
    </form>
  );
};

export default ProductFilters;
