import type { CartRepositoryPort } from "../../domain/ports/CartRepositoryPort.js";
import { CartId } from "../../domain/value-objects/CartId.js";
import { Cart } from "../../domain/entities/Cart.js";
import type { GetCartRequestDTO, CartResponseDTO } from "../dtos/CartDTOs.js";
import { toCartResponse } from "../dtos/mappers.js";

export class GetCartUseCase {
  constructor(private readonly cartRepository: CartRepositoryPort) {}

  /** Read-only: a cart that was never created is reported as empty (and is not persisted). */
  async execute(request: GetCartRequestDTO): Promise<CartResponseDTO> {
    const cartId = new CartId(request.cartId);
    const cart = (await this.cartRepository.findById(cartId)) ?? new Cart(cartId);
    return toCartResponse(cart);
  }
}
