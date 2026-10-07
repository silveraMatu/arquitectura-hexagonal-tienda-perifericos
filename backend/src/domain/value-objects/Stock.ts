import { InvalidStockError } from "../exceptions/InvalidStockError.js";
import type { Quantity } from "./Quantity.js";

export class Stock {
  private readonly _value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new InvalidStockError(value);
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  hasEnough(quantity: Quantity): boolean {
    return this._value >= quantity.value;
  }

  /** Assumes `hasEnough(quantity)` was already verified by the caller. */
  decrease(quantity: Quantity): Stock {
    return new Stock(this._value - quantity.value);
  }

  increase(quantity: Quantity): Stock {
    return new Stock(this._value + quantity.value);
  }

  equals(other: Stock): boolean {
    return other instanceof Stock && other._value === this._value;
  }

  toString(): string {
    return String(this._value);
  }
}
