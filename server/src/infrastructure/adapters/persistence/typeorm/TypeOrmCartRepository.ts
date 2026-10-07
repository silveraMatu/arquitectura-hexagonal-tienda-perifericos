import type { DataSource } from "typeorm";
import type { CartRepositoryPort } from "../../../../domain/ports/CartRepositoryPort.js";
import type { Cart } from "../../../../domain/entities/Cart.js";
import type { CartId } from "../../../../domain/value-objects/CartId.js";
import { CartOrmEntity } from "./entities/CartOrmEntity.js";
import { CartItemOrmEntity } from "./entities/CartItemOrmEntity.js";
import { toDomainCart, toCartOrmRow, toCartItemOrmRows } from "./mappers/CartOrmMapper.js";

export class TypeOrmCartRepository implements CartRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  async findById(id: CartId): Promise<Cart | null> {
    const cartRow = await this.dataSource.getRepository(CartOrmEntity).findOneBy({ id: id.value });
    if (!cartRow) {
      return null;
    }

    const itemRows = await this.dataSource
      .getRepository(CartItemOrmEntity)
      .find({ where: { cartId: id.value } });

    return toDomainCart(cartRow, itemRows);
  }

  /** Transactional: upserts the cart row and fully replaces its cart_items in one DB transaction. */
  async save(cart: Cart): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.upsert(CartOrmEntity, toCartOrmRow(cart), ["id"]);
      await manager.delete(CartItemOrmEntity, { cartId: cart.id.value });

      const itemRows = toCartItemOrmRows(cart);
      if (itemRows.length > 0) {
        await manager.insert(CartItemOrmEntity, itemRows);
      }
    });
  }
}
