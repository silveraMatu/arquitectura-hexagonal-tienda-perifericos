import type {
  ProductRepositoryPort,
  ProductSearchCriteria,
} from "../../../domain/ports/ProductRepositoryPort.js";
import type { Product } from "../../../domain/entities/Product.js";
import type { ProductId } from "../../../domain/value-objects/ProductId.js";
import { KeyedAsyncLock } from "./KeyedAsyncLock.js";

export class InMemoryProductRepository implements ProductRepositoryPort {
  private readonly products = new Map<string, Product>();
  private readonly lock = new KeyedAsyncLock();

  constructor(seed: Product[] = []) {
    for (const product of seed) {
      this.products.set(product.id.value, product);
    }
  }

  async findById(id: ProductId): Promise<Product | null> {
    return this.products.get(id.value) ?? null;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async search(criteria: ProductSearchCriteria): Promise<Product[]> {
    const term = criteria.name?.trim().toLowerCase();

    return Array.from(this.products.values()).filter((product) => {
      const matchesName = term ? product.name.value.toLowerCase().includes(term) : true;
      const matchesMin = criteria.minPrice !== undefined ? product.price.value >= criteria.minPrice : true;
      const matchesMax = criteria.maxPrice !== undefined ? product.price.value <= criteria.maxPrice : true;
      return matchesName && matchesMin && matchesMax;
    });
  }

  async save(product: Product): Promise<void> {
    await this.lock.runExclusive(product.id.value, () => {
      this.products.set(product.id.value, product);
    });
  }
}
