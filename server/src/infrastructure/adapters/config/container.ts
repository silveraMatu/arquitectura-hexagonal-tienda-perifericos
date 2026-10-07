import type { DataSource } from "typeorm";
import { TypeOrmProductRepository } from "../persistence/typeorm/TypeOrmProductRepository.js";
import { TypeOrmCartRepository } from "../persistence/typeorm/TypeOrmCartRepository.js";
import { ListProductsUseCase } from "../../../application/use-cases/ListProductsUseCase.js";
import { SearchProductsUseCase } from "../../../application/use-cases/SearchProductsUseCase.js";
import { GetProductDetailUseCase } from "../../../application/use-cases/GetProductDetailUseCase.js";
import { GetCartUseCase } from "../../../application/use-cases/GetCartUseCase.js";
import { AddItemToCartUseCase } from "../../../application/use-cases/AddItemToCartUseCase.js";
import { RemoveItemFromCartUseCase } from "../../../application/use-cases/RemoveItemFromCartUseCase.js";
import { CheckoutUseCase } from "../../../application/use-cases/CheckoutUseCase.js";
import { ProductController } from "../api/controllers/ProductController.js";
import { CartController } from "../api/controllers/CartController.js";

export interface Container {
  productController: ProductController;
  cartController: CartController;
}

export function buildContainer(dataSource: DataSource): Container {
  const productRepository = new TypeOrmProductRepository(dataSource);
  const cartRepository = new TypeOrmCartRepository(dataSource);

  const listProductsUseCase = new ListProductsUseCase(productRepository);
  const searchProductsUseCase = new SearchProductsUseCase(productRepository);
  const getProductDetailUseCase = new GetProductDetailUseCase(productRepository);
  const getCartUseCase = new GetCartUseCase(cartRepository);
  const addItemToCartUseCase = new AddItemToCartUseCase(productRepository, cartRepository);
  const removeItemFromCartUseCase = new RemoveItemFromCartUseCase(cartRepository);
  const checkoutUseCase = new CheckoutUseCase(productRepository, cartRepository);

  const productController = new ProductController(
    listProductsUseCase,
    searchProductsUseCase,
    getProductDetailUseCase,
  );
  const cartController = new CartController(
    getCartUseCase,
    addItemToCartUseCase,
    removeItemFromCartUseCase,
    checkoutUseCase,
  );

  return { productController, cartController };
}
