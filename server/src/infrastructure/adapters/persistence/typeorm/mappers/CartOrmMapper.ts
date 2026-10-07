import { Cart, type AddHistoryEntry } from "../../../../../domain/entities/Cart.js";
import { CartItem } from "../../../../../domain/entities/CartItem.js";
import { CartId } from "../../../../../domain/value-objects/CartId.js";
import { ProductId } from "../../../../../domain/value-objects/ProductId.js";
import { ProductName } from "../../../../../domain/value-objects/ProductName.js";
import { Price } from "../../../../../domain/value-objects/Price.js";
import { Quantity } from "../../../../../domain/value-objects/Quantity.js";
import { CartOrmEntity } from "../entities/CartOrmEntity.js";
import { CartItemOrmEntity } from "../entities/CartItemOrmEntity.js";

export function toDomainCart(cartRow: CartOrmEntity, itemRows: CartItemOrmEntity[]): Cart {
  const items = itemRows.map(
    (row) =>
      new CartItem({
        productId: new ProductId(row.productId),
        productName: new ProductName(row.productName),
        unitPrice: new Price(row.unitPrice),
        quantity: new Quantity(row.quantity),
      }),
  );

  const history: AddHistoryEntry[] = cartRow.history.map((entry) => ({
    productId: new ProductId(entry.productId),
    quantityAdded: new Quantity(entry.quantityAdded),
  }));

  return Cart.reconstitute(new CartId(cartRow.id), items, history);
}

export function toCartOrmRow(cart: Cart): CartOrmEntity {
  const row = new CartOrmEntity();
  row.id = cart.id.value;
  row.history = cart.getHistorySnapshot().map((entry) => ({
    productId: entry.productId.value,
    quantityAdded: entry.quantityAdded.value,
  }));
  return row;
}

export function toCartItemOrmRows(cart: Cart): CartItemOrmEntity[] {
  return cart.items.map((item) => {
    const row = new CartItemOrmEntity();
    row.cartId = cart.id.value;
    row.productId = item.productId.value;
    row.productName = item.productName.value;
    row.unitPrice = item.unitPrice.value;
    row.quantity = item.quantity.value;
    return row;
  });
}
