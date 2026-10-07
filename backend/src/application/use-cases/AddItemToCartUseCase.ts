import type { ProductRepositoryPort } from "../../domain/ports/ProductRepositoryPort.js";
import type { CartRepositoryPort } from "../../domain/ports/CartRepositoryPort.js";
import { ProductId } from "../../domain/value-objects/ProductId.js";
import { CartId } from "../../domain/value-objects/CartId.js";
import { Quantity } from "../../domain/value-objects/Quantity.js";
import { Cart } from "../../domain/entities/Cart.js";
import { ProductNotFoundError } from "../../domain/exceptions/ProductNotFoundError.js";
import type { AddItemToCartRequestDTO } from "../dtos/CartDTOs.js";
import type { CartResponseDTO } from "../dtos/CartDTOs.js";
import { toCartResponse } from "../dtos/mappers.js";

export class AddItemToCartUseCase {
  constructor(
    private readonly productRepository: ProductRepositoryPort,
    private readonly cartRepository: CartRepositoryPort,
  ) {}

  async execute(request: AddItemToCartRequestDTO): Promise<CartResponseDTO> {
    const productId = new ProductId(request.productId);
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ProductNotFoundError(productId.value);
    }

    const cartId = new CartId(request.cartId);
    const cart = (await this.cartRepository.findById(cartId)) ?? new Cart(cartId);

    cart.addItem(product, new Quantity(request.quantity));

    await this.cartRepository.save(cart);
    return toCartResponse(cart);
  }
}
