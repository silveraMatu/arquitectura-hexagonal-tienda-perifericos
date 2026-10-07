function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** A non-negative monetary amount, used for computed totals (unlike Price, zero is valid here). */
export class Money {
  private readonly _value: number;

  constructor(value: number) {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`Invalid money amount "${value}". Amount must be a finite number greater than or equal to zero.`);
    }
    this._value = round2(value);
  }

  static zero(): Money {
    return new Money(0);
  }

  get value(): number {
    return this._value;
  }

  add(other: Money): Money {
    return new Money(this._value + other._value);
  }

  equals(other: Money): boolean {
    return other instanceof Money && other._value === this._value;
  }

  toString(): string {
    return this._value.toFixed(2);
  }
}
