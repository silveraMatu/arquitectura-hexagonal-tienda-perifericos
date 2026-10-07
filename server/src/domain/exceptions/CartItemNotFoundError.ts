import { DomainError } from "./DomainError.js";

export class CartItemNotFoundError extends DomainError {
  constructor(productId: string) {
    super(`Cart item for product "${productId}" was not found.`);
  }
}
