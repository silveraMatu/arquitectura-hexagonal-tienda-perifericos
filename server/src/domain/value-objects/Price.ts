import { InvalidPriceError } from "../exceptions/InvalidPriceError.js";
import { Money } from "./Money.js";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** A strictly positive unit price for a product. For computed sums/totals, see Money. */
export class Price {
  private readonly _value: number;

  constructor(value: number) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new InvalidPriceError(value);
    }
    this._value = round2(value);
  }

  get value(): number {
    return this._value;
  }

  multiply(factor: number): Money {
    if (!Number.isFinite(factor) || factor <= 0) {
      throw new InvalidPriceError(factor);
    }
    return new Money(this._value * factor);
  }

  toMoney(): Money {
    return new Money(this._value);
  }

  equals(other: Price): boolean {
    return other instanceof Price && other._value === this._value;
  }

  toString(): string {
    return this._value.toFixed(2);
  }
}
