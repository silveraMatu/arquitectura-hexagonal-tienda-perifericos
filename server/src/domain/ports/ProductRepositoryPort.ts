import type { Product } from "../entities/Product.js";
import type { ProductId } from "../value-objects/ProductId.js";

export interface ProductSearchCriteria {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductRepositoryPort {
  findById(id: ProductId): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  search(criteria: ProductSearchCriteria): Promise<Product[]>;
  save(product: Product): Promise<void>;
}
