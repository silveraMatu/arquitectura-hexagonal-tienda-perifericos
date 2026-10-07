import type { ProductRepositoryPort } from "../../domain/ports/ProductRepositoryPort.js";
import { ProductId } from "../../domain/value-objects/ProductId.js";
import { ProductNotFoundError } from "../../domain/exceptions/ProductNotFoundError.js";
import type { GetProductDetailRequestDTO, ProductResponseDTO } from "../dtos/ProductDTOs.js";
import { toProductResponse } from "../dtos/mappers.js";

export class GetProductDetailUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(request: GetProductDetailRequestDTO): Promise<ProductResponseDTO> {
    const productId = new ProductId(request.productId);
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ProductNotFoundError(productId.value);
    }
    return toProductResponse(product);
  }
}
