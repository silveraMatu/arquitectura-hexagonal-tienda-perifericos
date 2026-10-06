export class ProductId {
  private readonly _value: string;

  constructor(value: string) {
    const trimmed = value?.trim();
    if (!trimmed) {
      throw new Error("ProductId cannot be empty.");
    }
    this._value = trimmed;
  }

  get value(): string {
    return this._value;
  }

  equals(other: ProductId): boolean {
    return other instanceof ProductId && other._value === this._value;
  }

  toString(): string {
    return this._value;
  }
}
