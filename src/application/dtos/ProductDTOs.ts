export interface ProductResponseDTO {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly stock: number;
}

export interface SearchProductsRequestDTO {
  readonly name?: string;
  readonly minPrice?: number;
  readonly maxPrice?: number;
}

export interface GetProductDetailRequestDTO {
  readonly productId: string;
}
