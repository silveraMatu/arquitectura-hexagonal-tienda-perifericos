import { DomainError } from "./DomainError.js";

export class InvalidStockError extends DomainError {
  constructor(value: number) {
    super(`Invalid stock "${value}". Stock must be an integer greater than or equal to zero.`);
  }
}
