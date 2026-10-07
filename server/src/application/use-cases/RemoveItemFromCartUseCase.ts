import type { CartRepositoryPort } from "../../domain/ports/CartRepositoryPort.js";
import { ProductId } from "../../domain/value-objects/ProductId.js";
import { CartId } from "../../domain/value-objects/CartId.js";
import { CartNotFoundError } from "../../domain/exceptions/CartNotFoundError.js";
import type { RemoveItemFromCartRequestDTO, CartResponseDTO } from "../dtos/CartDTOs.js";
import { toCartResponse } from "../dtos/mappers.js";

export class RemoveItemFromCartUseCase {
  constructor(private readonly cartRepository: CartRepositoryPort) {}

  async execute(request: RemoveItemFromCartRequestDTO): Promise<CartResponseDTO> {
    const cartId = new CartId(request.cartId);
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) {
      throw new CartNotFoundError(cartId.value);
    }

    if (request.mode === "undo") {
      cart.undoLastAdd();
    } else {
      cart.removeItem(new ProductId(request.productId));
    }

    await this.cartRepository.save(cart);
    return toCartResponse(cart);
  }
}
