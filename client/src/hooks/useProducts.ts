'use client';

import { useQuery } from '@tanstack/react-query';
import { getProduct, getProducts, searchProducts } from '@/lib/api/products';
import { queryKeys } from '@/lib/query-keys';
import type { ProductFilters } from '@/types/api';

const hasFilters = ({ q, minPrice, maxPrice }: ProductFilters) =>
  Boolean(q) || minPrice !== undefined || maxPrice !== undefined;

/** GET /products without filters, GET /products/search as soon as any filter is set. */
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => (hasFilters(filters) ? searchProducts(filters) : getProducts()),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProduct(id),
  });
}
