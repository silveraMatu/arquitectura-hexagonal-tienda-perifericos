import { InvalidQuantityError } from "../exceptions/InvalidQuantityError.js";

export class Quantity {
  private readonly _value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value < 1) {
      throw new InvalidQuantityError(value);
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  add(other: Quantity): Quantity {
    return new Quantity(this._value + other._value);
  }

  subtract(other: Quantity): Quantity {
    return new Quantity(this._value - other._value);
  }

  isGreaterThan(other: Quantity): boolean {
    return this._value > other._value;
  }

  equals(other: Quantity): boolean {
    return other instanceof Quantity && other._value === this._value;
  }

  toString(): string {
    return String(this._value);
  }
}
