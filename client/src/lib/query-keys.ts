import { DEFAULT_CART_ID } from '@/lib/config';
import type { ProductFilters } from '@/types/api';

export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (filters: ProductFilters) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
  },
  cart: ['cart', DEFAULT_CART_ID] as const,
};
