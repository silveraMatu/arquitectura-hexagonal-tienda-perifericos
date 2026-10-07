// Shapes from ENDPOINTS-CONTRACTS.md — that file is the source of truth.

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface CartItem {
  productId: string;
  /** Snapshot taken when the item was added. */
  productName: string;
  /** Snapshot taken when the item was added: never recalculate it from the product. */
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  cartId: string;
  items: CartItem[];
  total: number;
  isEmpty: boolean;
}

export interface CheckoutResponse {
  cartId: string;
  purchasedItems: CartItem[];
  total: number;
}

export interface AddCartItemRequest {
  productId: string;
  quantity: number;
}

export interface ProductFilters {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
}

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'PRODUCT_NOT_FOUND'
  | 'CART_NOT_FOUND'
  | 'CART_ITEM_NOT_FOUND'
  | 'ROUTE_NOT_FOUND'
  | 'INSUFFICIENT_STOCK'
  | 'INVALID_PRICE'
  | 'INVALID_STOCK'
  | 'INVALID_QUANTITY'
  | 'INVALID_PRODUCT_NAME'
  | 'EMPTY_CART'
  | 'NO_ACTIONS_TO_UNDO'
  | 'INTERNAL_ERROR';

/** Client-side codes for failures that never reached (or never came back from) the API. */
export type ClientErrorCode = 'NETWORK_ERROR' | 'CONFIG_ERROR' | 'UNKNOWN_ERROR';

export type ErrorCode = ApiErrorCode | ClientErrorCode;

export interface ApiErrorDetail {
  path: string;
  message: string;
}

export interface ApiErrorBody {
  error: string;
  code: string;
  details?: ApiErrorDetail[];
}
