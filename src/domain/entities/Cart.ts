import { CartId } from "../value-objects/CartId.js";
import { ProductId } from "../value-objects/ProductId.js";
import { Money } from "../value-objects/Money.js";
import { Quantity } from "../value-objects/Quantity.js";
import type { Product } from "./Product.js";
import { CartItem } from "./CartItem.js";
import { InsufficientStockError } from "../exceptions/InsufficientStockError.js";
import { CartItemNotFoundError } from "../exceptions/CartItemNotFoundError.js";
import { NoActionsToUndoError } from "../exceptions/NoActionsToUndoError.js";

interface AddHistoryEntry {
  productId: ProductId;
  quantityAdded: Quantity;
}

/** Aggregate root: owns its items and the invariants around adding/removing them. */
export class Cart {
  private readonly _id: CartId;
  private _items: CartItem[];
  private _history: AddHistoryEntry[];

  constructor(id: CartId, items: CartItem[] = []) {
    this._id = id;
    this._items = [...items];
    this._history = [];
  }

  get id(): CartId {
    return this._id;
  }

  get items(): readonly CartItem[] {
    return [...this._items];
  }

  isEmpty(): boolean {
    return this._items.length === 0;
  }

  getTotal(): Money {
    return this._items.reduce((total, item) => total.add(item.subtotal()), Money.zero());
  }

  /** Adds `quantity` units of `product`, merging with any existing line for the same product. */
  addItem(product: Product, quantity: Quantity): void {
    const existing = this.findItem(product.id);
    const totalRequested = existing ? existing.quantity.add(quantity) : quantity;

    if (!product.hasEnoughStock(totalRequested)) {
      throw new InsufficientStockError(product.id.value, totalRequested.value, product.stock.value);
    }

    if (existing) {
      this._items = this._items.map((item) =>
        item.productId.equals(product.id) ? item.withQuantity(totalRequested) : item,
      );
    } else {
      this._items.push(
        new CartItem({
          productId: product.id,
          productName: product.name,
          unitPrice: product.price,
          quantity,
        }),
      );
    }

    this._history.push({ productId: product.id, quantityAdded: quantity });
  }

  /** Removes a cart line directly, regardless of history order. */
  removeItem(productId: ProductId): void {
    const existing = this.findItem(productId);
    if (!existing) {
      throw new CartItemNotFoundError(productId.value);
    }
    this._items = this._items.filter((item) => !item.productId.equals(productId));
    this._history = this._history.filter((entry) => !entry.productId.equals(productId));
  }

  /** LIFO undo: reverts the most recent `addItem` call. */
  undoLastAdd(): void {
    const lastEntry = this._history.pop();
    if (!lastEntry) {
      throw new NoActionsToUndoError(this._id.value);
    }

    const existing = this.findItem(lastEntry.productId);
    if (!existing) {
      throw new CartItemNotFoundError(lastEntry.productId.value);
    }

    if (existing.quantity.equals(lastEntry.quantityAdded)) {
      this._items = this._items.filter((item) => !item.productId.equals(lastEntry.productId));
    } else {
      const remaining = existing.quantity.subtract(lastEntry.quantityAdded);
      this._items = this._items.map((item) =>
        item.productId.equals(lastEntry.productId) ? item.withQuantity(remaining) : item,
      );
    }
  }

  /** Empties the cart's items and add-history, typically after a successful checkout. */
  clear(): void {
    this._items = [];
    this._history = [];
  }

  private findItem(productId: ProductId): CartItem | undefined {
    return this._items.find((item) => item.productId.equals(productId));
  }
}
