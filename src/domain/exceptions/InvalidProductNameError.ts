import { DomainError } from "./DomainError.js";

export class InvalidProductNameError extends DomainError {
  constructor(reason: string) {
    super(`Invalid product name: ${reason}`);
  }
}
