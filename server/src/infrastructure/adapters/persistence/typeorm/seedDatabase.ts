import type { ProductRepositoryPort } from "../../../../domain/ports/ProductRepositoryPort.js";
import { createSeedProducts } from "../seedProducts.js";

export async function seedProductsIfEmpty(productRepository: ProductRepositoryPort): Promise<void> {
  const existing = await productRepository.findAll();
  if (existing.length > 0) {
    return;
  }

  const seeds = createSeedProducts();
  for (const product of seeds) {
    await productRepository.save(product);
  }
  console.log(`Seeded ${seeds.length} products.`);
}
