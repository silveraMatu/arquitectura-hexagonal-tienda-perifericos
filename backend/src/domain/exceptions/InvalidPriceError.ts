import { DomainError } from "./DomainError.js";

export class InvalidPriceError extends DomainError {
  constructor(value: number) {
    super(`Invalid price "${value}". Price must be a finite number greater than zero.`);
  }
}
