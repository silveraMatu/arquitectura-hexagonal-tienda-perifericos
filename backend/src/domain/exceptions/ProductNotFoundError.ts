import { DomainError } from "./DomainError.js";

export class ProductNotFoundError extends DomainError {
  constructor(productId: string) {
    super(`Product with id "${productId}" was not found.`);
  }
}
