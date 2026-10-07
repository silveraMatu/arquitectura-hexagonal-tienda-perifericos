import { InMemoryProductRepository } from "../persistence/InMemoryProductRepository.js";
import { InMemoryCartRepository } from "../persistence/InMemoryCartRepository.js";
import { createSeedProducts } from "../persistence/seedProducts.js";
import { ListProductsUseCase } from "../../../application/use-cases/ListProductsUseCase.js";
import { SearchProductsUseCase } from "../../../application/use-cases/SearchProductsUseCase.js";
import { GetProductDetailUseCase } from "../../../application/use-cases/GetProductDetailUseCase.js";
import { AddItemToCartUseCase } from "../../../application/use-cases/AddItemToCartUseCase.js";
import { RemoveItemFromCartUseCase } from "../../../application/use-cases/RemoveItemFromCartUseCase.js";
import { CheckoutUseCase } from "../../../application/use-cases/CheckoutUseCase.js";
import { ProductController } from "../api/controllers/ProductController.js";
import { CartController } from "../api/controllers/CartController.js";

export interface Container {
  productController: ProductController;
  cartController: CartController;
}

export function buildContainer(): Container {
  const productRepository = new InMemoryProductRepository(createSeedProducts());
  const cartRepository = new InMemoryCartRepository();

  const listProductsUseCase = new ListProductsUseCase(productRepository);
  const searchProductsUseCase = new SearchProductsUseCase(productRepository);
  const getProductDetailUseCase = new GetProductDetailUseCase(productRepository);
  const addItemToCartUseCase = new AddItemToCartUseCase(productRepository, cartRepository);
  const removeItemFromCartUseCase = new RemoveItemFromCartUseCase(cartRepository);
  const checkoutUseCase = new CheckoutUseCase(productRepository, cartRepository);

  const productController = new ProductController(
    listProductsUseCase,
    searchProductsUseCase,
    getProductDetailUseCase,
  );
  const cartController = new CartController(
    addItemToCartUseCase,
    removeItemFromCartUseCase,
    checkoutUseCase,
  );

  return { productController, cartController };
}
