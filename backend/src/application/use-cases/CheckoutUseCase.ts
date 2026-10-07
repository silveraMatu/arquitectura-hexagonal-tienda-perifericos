import type { ProductRepositoryPort } from "../../domain/ports/ProductRepositoryPort.js";
import type { CartRepositoryPort } from "../../domain/ports/CartRepositoryPort.js";
import { CartId } from "../../domain/value-objects/CartId.js";
import type { Product } from "../../domain/entities/Product.js";
import type { CartItem } from "../../domain/entities/CartItem.js";
import { CartNotFoundError } from "../../domain/exceptions/CartNotFoundError.js";
import { EmptyCartError } from "../../domain/exceptions/EmptyCartError.js";
import { ProductNotFoundError } from "../../domain/exceptions/ProductNotFoundError.js";
import { InsufficientStockError } from "../../domain/exceptions/InsufficientStockError.js";
import type { CheckoutRequestDTO, CheckoutResponseDTO } from "../dtos/CartDTOs.js";
import { toCartItemResponse } from "../dtos/mappers.js";

export class CheckoutUseCase {
  constructor(
    private readonly productRepository: ProductRepositoryPort,
    private readonly cartRepository: CartRepositoryPort,
  ) {}

  async execute(request: CheckoutRequestDTO): Promise<CheckoutResponseDTO> {
    const cartId = new CartId(request.cartId);
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) {
      throw new CartNotFoundError(cartId.value);
    }
    if (cart.isEmpty()) {
      throw new EmptyCartError(cartId.value);
    }

    const productsByItem = await this.resolveAndValidateStock(cart.items);

    for (const [item, product] of productsByItem) {
      product.decreaseStock(item.quantity);
      await this.productRepository.save(product);
    }

    const response: CheckoutResponseDTO = {
      cartId: cart.id.value,
      purchasedItems: cart.items.map(toCartItemResponse),
      total: cart.getTotal().value,
    };

    cart.clear();
    await this.cartRepository.save(cart);

    return response;
  }

  /** Validates stock for every cart item before mutating anything, so checkout is all-or-nothing. */
  private async resolveAndValidateStock(
    items: readonly CartItem[],
  ): Promise<Array<[CartItem, Product]>> {
    const resolved: Array<[CartItem, Product]> = [];

    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new ProductNotFoundError(item.productId.value);
      }
      if (!product.hasEnoughStock(item.quantity)) {
        throw new InsufficientStockError(item.productId.value, item.quantity.value, product.stock.value);
      }
      resolved.push([item, product]);
    }

    return resolved;
  }
}
