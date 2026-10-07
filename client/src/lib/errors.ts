import { ApiRequestError } from '@/lib/api/client';
import type { ErrorCode } from '@/types/api';

const MESSAGES: Partial<Record<ErrorCode, string>> = {
  PRODUCT_NOT_FOUND: 'El producto no existe o ya no está disponible.',
  INSUFFICIENT_STOCK: 'No hay stock suficiente. Tu carrito no se modificó.',
  INVALID_QUANTITY: 'La cantidad debe ser un número entero mayor a 0.',
  CART_NOT_FOUND: 'No encontramos tu carrito.',
  CART_ITEM_NOT_FOUND: 'Ese producto ya no está en tu carrito.',
  NO_ACTIONS_TO_UNDO: 'No hay nada para deshacer.',
  EMPTY_CART: 'Tu carrito está vacío: agregá algún producto antes de finalizar la compra.',
  ROUTE_NOT_FOUND: 'No encontramos lo que buscabas.',
  INTERNAL_ERROR: 'Ocurrió un error en el servidor. Probá de nuevo en unos minutos.',
  NETWORK_ERROR: 'No pudimos conectarnos con la tienda. Revisá tu conexión y probá de nuevo.',
  CONFIG_ERROR: 'La tienda no está bien configurada (falta la URL de la API).',
};

const FALLBACK = 'Ocurrió un error inesperado. Probá de nuevo.';

/** Per-screen wording for a code, e.g. INSUFFICIENT_STOCK reads differently at checkout. */
export type ErrorMessageOverrides = Partial<Record<ErrorCode, string>>;

/** Maps any thrown value to a user-facing message. Never surfaces the raw API error. */
export function getErrorMessage(error: unknown, overrides: ErrorMessageOverrides = {}): string {
  if (!(error instanceof ApiRequestError)) return FALLBACK;
  const code = error.code as ErrorCode;

  const override = overrides[code];
  if (override) return override;

  if (code === 'VALIDATION_ERROR') {
    const details = error.details?.map((d) => d.message).filter(Boolean) ?? [];
    return details.length > 0
      ? `Revisá los datos ingresados: ${details.join(' · ')}`
      : 'Revisá los datos ingresados.';
  }

  return MESSAGES[code] ?? FALLBACK;
}

export const hasErrorCode = (error: unknown, code: ErrorCode): boolean =>
  error instanceof ApiRequestError && error.code === code;
