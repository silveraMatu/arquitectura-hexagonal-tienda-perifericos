import { DomainError } from "./DomainError.js";

export class CartNotFoundError extends DomainError {
  constructor(cartId: string) {
    super(`Cart with id "${cartId}" was not found.`);
  }
}
