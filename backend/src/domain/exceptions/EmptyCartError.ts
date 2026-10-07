import { DomainError } from "./DomainError.js";

export class EmptyCartError extends DomainError {
  constructor(cartId: string) {
    super(`Cart "${cartId}" is empty and cannot be checked out.`);
  }
}
