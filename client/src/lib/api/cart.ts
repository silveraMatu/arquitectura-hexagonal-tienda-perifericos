import { apiFetch } from './client';
import { DEFAULT_CART_ID } from '@/lib/config';
import type { AddCartItemRequest, CartResponse, CheckoutResponse } from '@/types/api';

const cartQuery = { cartId: DEFAULT_CART_ID };

export const getCart = () => apiFetch<CartResponse>('/cart', { query: cartQuery });

export const addCartItem = ({ productId, quantity }: AddCartItemRequest) =>
  apiFetch<CartResponse>('/cart/items', {
    method: 'POST',
    body: { productId, quantity, cartId: DEFAULT_CART_ID },
  });

export const undoLastAdd = () =>
  apiFetch<CartResponse>('/cart/items/undo', { method: 'DELETE', query: cartQuery });

export const removeCartItem = (productId: string) =>
  apiFetch<CartResponse>(`/cart/items/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    query: cartQuery,
  });

export const checkout = () =>
  apiFetch<CheckoutResponse>('/cart/checkout', {
    method: 'POST',
    body: { cartId: DEFAULT_CART_ID },
  });
