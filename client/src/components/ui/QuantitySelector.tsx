'use client';

import React, { useId } from 'react';

interface QuantitySelectorProps {
  label: string;
  /** Raw input text, so the user can type freely; the parent validates it with parseQuantity. */
  value: string;
  onChange: (value: string) => void;
  max: number;
  error?: string | null;
  disabled?: boolean;
}

export const parseQuantity = (raw: string, max: number): { quantity: number | null; error: string | null } => {
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed) || Number(trimmed) < 1) {
    return { quantity: null, error: 'La cantidad debe ser un número entero mayor a 0.' };
  }
  const quantity = Number(trimmed);
  if (quantity > max) {
    return { quantity: null, error: `Podés agregar hasta ${max} ${max === 1 ? 'unidad' : 'unidades'}.` };
  }
  return { quantity, error: null };
};

const stepButtonClass =
  'w-11 h-11 shrink-0 rounded-full border border-white/20 text-text-primary text-lg leading-none flex items-center justify-center hover:bg-white/[0.08] hover:border-white/30 transition-all duration-200 disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-transparent';

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ label, value, onChange, max, error, disabled = false }) => {
  const id = useId();
  const current = Number(value);
  const numeric = Number.isInteger(current) ? current : 1;

  return (
    <div>
      <label htmlFor={id} className="block text-[11px] uppercase tracking-widest text-text-secondary font-semibold mb-2 pl-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={stepButtonClass}
          onClick={() => onChange(String(Math.max(1, numeric - 1)))}
          disabled={disabled || numeric <= 1}
          aria-label="Restar una unidad"
        >
          −
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={1}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-20 h-11 text-center bg-white/5 border border-white/10 rounded-full text-[15px] text-text-primary hover:border-white/20 focus-visible:border-accent transition-colors disabled:opacity-45"
        />
        <button
          type="button"
          className={stepButtonClass}
          onClick={() => onChange(String(Math.min(max, numeric + 1)))}
          disabled={disabled || numeric >= max}
          aria-label="Sumar una unidad"
        >
          +
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 pl-1 text-[13px] text-text-primary">
          {error}
        </p>
      )}
    </div>
  );
};

export default QuantitySelector;
