import { ProductId } from "../value-objects/ProductId.js";
import { ProductName } from "../value-objects/ProductName.js";
import { Price } from "../value-objects/Price.js";
import { Stock } from "../value-objects/Stock.js";
import type { Quantity } from "../value-objects/Quantity.js";
import { InsufficientStockError } from "../exceptions/InsufficientStockError.js";

export interface ProductProps {
  id: ProductId;
  name: ProductName;
  description: string;
  price: Price;
  stock: Stock;
}

export class Product {
  private readonly _id: ProductId;
  private _name: ProductName;
  private _description: string;
  private _price: Price;
  private _stock: Stock;

  constructor(props: ProductProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description.trim();
    this._price = props.price;
    this._stock = props.stock;
  }

  get id(): ProductId {
    return this._id;
  }

  get name(): ProductName {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get price(): Price {
    return this._price;
  }

  get stock(): Stock {
    return this._stock;
  }

  hasEnoughStock(quantity: Quantity): boolean {
    return this._stock.hasEnough(quantity);
  }

  /** Decreases stock after a checkout. Throws InsufficientStockError if not enough units remain. */
  decreaseStock(quantity: Quantity): void {
    if (!this._stock.hasEnough(quantity)) {
      throw new InsufficientStockError(this._id.value, quantity.value, this._stock.value);
    }
    this._stock = this._stock.decrease(quantity);
  }

  restoreStock(quantity: Quantity): void {
    this._stock = this._stock.increase(quantity);
  }

  rename(name: ProductName): void {
    this._name = name;
  }

  changePrice(price: Price): void {
    this._price = price;
  }

  equals(other: Product): boolean {
    return other instanceof Product && other._id.equals(this._id);
  }
}
