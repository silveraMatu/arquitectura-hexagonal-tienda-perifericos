'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addCartItem, checkout, getCart, removeCartItem, undoLastAdd } from '@/lib/api/cart';
import { queryKeys } from '@/lib/query-keys';
import type { CartResponse } from '@/types/api';

export function useCart() {
  return useQuery({ queryKey: queryKeys.cart, queryFn: getCart });
}

/** Every cart mutation returns the updated cart: write it to the cache, then refetch to confirm. */
function useCartMutation<TVariables>(mutationFn: (variables: TVariables) => Promise<CartResponse>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (cart) => queryClient.setQueryData(queryKeys.cart, cart),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart }),
  });
}

export const useAddToCart = () => useCartMutation(addCartItem);

export const useUndoLastAdd = () => useCartMutation(undoLastAdd);

export const useRemoveCartItem = () => useCartMutation(removeCartItem);

export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkout,
    // The API empties the cart on success: reflect it right away (header counter included).
    onSuccess: ({ cartId }) =>
      queryClient.setQueryData<CartResponse>(queryKeys.cart, { cartId, items: [], total: 0, isEmpty: true }),
    // Checkout empties the cart and lowers stock, so both need a refetch (also after a failure).
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.cart }),
        queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
      ]),
  });
}

export const cartUnitCount = (cart: CartResponse | undefined): number =>
  cart?.items.reduce((count, item) => count + item.quantity, 0) ?? 0;
