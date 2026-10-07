import type { Request, Response } from "express";
import { z } from "zod";
import type { ListProductsUseCase } from "../../../../application/use-cases/ListProductsUseCase.js";
import type { SearchProductsUseCase } from "../../../../application/use-cases/SearchProductsUseCase.js";
import type { GetProductDetailUseCase } from "../../../../application/use-cases/GetProductDetailUseCase.js";
import type { SearchProductsRequestDTO } from "../../../../application/dtos/ProductDTOs.js";

const searchQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  min_price: z.coerce.number().nonnegative().optional(),
  max_price: z.coerce.number().nonnegative().optional(),
});

const productIdParamSchema = z.object({
  id: z.string().trim().min(1),
});

export class ProductController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly searchProductsUseCase: SearchProductsUseCase,
    private readonly getProductDetailUseCase: GetProductDetailUseCase,
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const products = await this.listProductsUseCase.execute();
    res.status(200).json(products);
  };

  search = async (req: Request, res: Response): Promise<void> => {
    const query = searchQuerySchema.parse(req.query);

    const request: SearchProductsRequestDTO = {
      ...(query.q !== undefined ? { name: query.q } : {}),
      ...(query.min_price !== undefined ? { minPrice: query.min_price } : {}),
      ...(query.max_price !== undefined ? { maxPrice: query.max_price } : {}),
    };

    const products = await this.searchProductsUseCase.execute(request);
    res.status(200).json(products);
  };

  getDetail = async (req: Request, res: Response): Promise<void> => {
    const params = productIdParamSchema.parse(req.params);
    const product = await this.getProductDetailUseCase.execute({ productId: params.id });
    res.status(200).json(product);
  };
}
