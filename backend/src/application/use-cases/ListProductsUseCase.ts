import type { ProductRepositoryPort } from "../../domain/ports/ProductRepositoryPort.js";
import type { ProductResponseDTO } from "../dtos/ProductDTOs.js";
import { toProductResponse } from "../dtos/mappers.js";

export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.findAll();
    return products.map(toProductResponse);
  }
}
