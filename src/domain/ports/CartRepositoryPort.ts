import type { Cart } from "../entities/Cart.js";
import type { CartId } from "../value-objects/CartId.js";

/** Output port the domain relies on to persist/retrieve Cart aggregates. */
export interface CartRepositoryPort {
  findById(id: CartId): Promise<Cart | null>;
  save(cart: Cart): Promise<void>;
}
