import type { ProductRepositoryPort, ProductSearchCriteria } from "../../domain/ports/ProductRepositoryPort.js";
import type { SearchProductsRequestDTO, ProductResponseDTO } from "../dtos/ProductDTOs.js";
import { toProductResponse } from "../dtos/mappers.js";

export class SearchProductsUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(request: SearchProductsRequestDTO): Promise<ProductResponseDTO[]> {
    const criteria: ProductSearchCriteria = {};
    if (request.name !== undefined) {
      criteria.name = request.name;
    }
    if (request.minPrice !== undefined) {
      criteria.minPrice = request.minPrice;
    }
    if (request.maxPrice !== undefined) {
      criteria.maxPrice = request.maxPrice;
    }

    const products = await this.productRepository.search(criteria);
    return products.map(toProductResponse);
  }
}
