import type { CartRepositoryPort } from "../../../domain/ports/CartRepositoryPort.js";
import type { Cart } from "../../../domain/entities/Cart.js";
import type { CartId } from "../../../domain/value-objects/CartId.js";
import { KeyedAsyncLock } from "./KeyedAsyncLock.js";

export class InMemoryCartRepository implements CartRepositoryPort {
  private readonly carts = new Map<string, Cart>();
  private readonly lock = new KeyedAsyncLock();

  async findById(id: CartId): Promise<Cart | null> {
    return this.carts.get(id.value) ?? null;
  }

  async save(cart: Cart): Promise<void> {
    await this.lock.runExclusive(cart.id.value, () => {
      this.carts.set(cart.id.value, cart);
    });
  }
}
