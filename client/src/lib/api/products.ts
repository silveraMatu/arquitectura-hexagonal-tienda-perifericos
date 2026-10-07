import { apiFetch } from './client';
import type { Product, ProductFilters } from '@/types/api';

export const getProducts = () => apiFetch<Product[]>('/products');

export const searchProducts = ({ q, minPrice, maxPrice }: ProductFilters) =>
  apiFetch<Product[]>('/products/search', {
    query: { q, min_price: minPrice, max_price: maxPrice },
  });

export const getProduct = (id: string) => apiFetch<Product>(`/products/${encodeURIComponent(id)}`);
