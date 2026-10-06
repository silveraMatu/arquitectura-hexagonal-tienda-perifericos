import { DomainError } from "./DomainError.js";

export class InsufficientStockError extends DomainError {
  constructor(productId: string, requested: number, available: number) {
    super(
      `Cannot fulfill request of ${requested} unit(s) for product "${productId}": only ${available} unit(s) available.`,
    );
  }
}
