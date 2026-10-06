export class CartId {
  private readonly _value: string;

  constructor(value: string) {
    const trimmed = value?.trim();
    if (!trimmed) {
      throw new Error("CartId cannot be empty.");
    }
    this._value = trimmed;
  }

  get value(): string {
    return this._value;
  }

  equals(other: CartId): boolean {
    return other instanceof CartId && other._value === this._value;
  }

  toString(): string {
    return this._value;
  }
}
