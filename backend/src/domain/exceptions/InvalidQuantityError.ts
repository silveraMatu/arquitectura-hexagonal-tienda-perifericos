import { DomainError } from "./DomainError.js";

export class InvalidQuantityError extends DomainError {
  constructor(value: number) {
    super(`Invalid quantity "${value}". Quantity must be an integer greater than or equal to one.`);
  }
}
