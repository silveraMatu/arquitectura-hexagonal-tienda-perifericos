import { InvalidProductNameError } from "../exceptions/InvalidProductNameError.js";

const MAX_LENGTH = 120;

export class ProductName {
  private readonly _value: string;

  constructor(value: string) {
    const trimmed = value?.trim() ?? "";
    if (trimmed.length === 0) {
      throw new InvalidProductNameError("name cannot be empty.");
    }
    if (trimmed.length > MAX_LENGTH) {
      throw new InvalidProductNameError(`name cannot exceed ${MAX_LENGTH} characters.`);
    }
    this._value = trimmed;
  }

  get value(): string {
    return this._value;
  }

  equals(other: ProductName): boolean {
    return other instanceof ProductName && other._value === this._value;
  }

  toString(): string {
    return this._value;
  }
}
