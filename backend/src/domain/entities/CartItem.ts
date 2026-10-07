import { ProductId } from "../value-objects/ProductId.js";
import { ProductName } from "../value-objects/ProductName.js";
import { Price } from "../value-objects/Price.js";
import { Money } from "../value-objects/Money.js";
import { Quantity } from "../value-objects/Quantity.js";

export interface CartItemProps {
  productId: ProductId;
  productName: ProductName;
  unitPrice: Price;
  quantity: Quantity;
}

/** Immutable snapshot of a product line inside a Cart. */
export class CartItem {
  private readonly _productId: ProductId;
  private readonly _productName: ProductName;
  private readonly _unitPrice: Price;
  private readonly _quantity: Quantity;

  constructor(props: CartItemProps) {
    this._productId = props.productId;
    this._productName = props.productName;
    this._unitPrice = props.unitPrice;
    this._quantity = props.quantity;
  }

  get productId(): ProductId {
    return this._productId;
  }

  get productName(): ProductName {
    return this._productName;
  }

  get unitPrice(): Price {
    return this._unitPrice;
  }

  get quantity(): Quantity {
    return this._quantity;
  }

  subtotal(): Money {
    return this._unitPrice.multiply(this._quantity.value);
  }

  withQuantity(quantity: Quantity): CartItem {
    return new CartItem({
      productId: this._productId,
      productName: this._productName,
      unitPrice: this._unitPrice,
      quantity,
    });
  }
}
