import { DomainError } from "./DomainError.js";

export class NoActionsToUndoError extends DomainError {
  constructor(cartId: string) {
    super(`Cart "${cartId}" has no actions left to undo.`);
  }
}
