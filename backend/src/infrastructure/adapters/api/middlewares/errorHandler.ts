import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { DomainError } from "../../../../domain/exceptions/DomainError.js";
import { ProductNotFoundError } from "../../../../domain/exceptions/ProductNotFoundError.js";
import { CartNotFoundError } from "../../../../domain/exceptions/CartNotFoundError.js";
import { CartItemNotFoundError } from "../../../../domain/exceptions/CartItemNotFoundError.js";
import { InsufficientStockError } from "../../../../domain/exceptions/InsufficientStockError.js";
import { InvalidPriceError } from "../../../../domain/exceptions/InvalidPriceError.js";
import { InvalidStockError } from "../../../../domain/exceptions/InvalidStockError.js";
import { InvalidQuantityError } from "../../../../domain/exceptions/InvalidQuantityError.js";
import { InvalidProductNameError } from "../../../../domain/exceptions/InvalidProductNameError.js";
import { EmptyCartError } from "../../../../domain/exceptions/EmptyCartError.js";
import { NoActionsToUndoError } from "../../../../domain/exceptions/NoActionsToUndoError.js";

interface ErrorMapping {
  status: number;
  code: string;
}

type DomainErrorConstructor = new (...args: never[]) => DomainError;

const DOMAIN_ERROR_MAPPINGS: ReadonlyArray<readonly [DomainErrorConstructor, ErrorMapping]> = [
  [ProductNotFoundError, { status: 404, code: "PRODUCT_NOT_FOUND" }],
  [CartNotFoundError, { status: 404, code: "CART_NOT_FOUND" }],
  [CartItemNotFoundError, { status: 404, code: "CART_ITEM_NOT_FOUND" }],
  [InsufficientStockError, { status: 409, code: "INSUFFICIENT_STOCK" }],
  [InvalidPriceError, { status: 422, code: "INVALID_PRICE" }],
  [InvalidStockError, { status: 422, code: "INVALID_STOCK" }],
  [InvalidQuantityError, { status: 422, code: "INVALID_QUANTITY" }],
  [InvalidProductNameError, { status: 422, code: "INVALID_PRODUCT_NAME" }],
  [EmptyCartError, { status: 422, code: "EMPTY_CART" }],
  [NoActionsToUndoError, { status: 422, code: "NO_ACTIONS_TO_UNDO" }],
];

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Invalid request data.",
      code: "VALIDATION_ERROR",
      details: err.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    });
    return;
  }

  for (const [ErrorClass, mapping] of DOMAIN_ERROR_MAPPINGS) {
    if (err instanceof ErrorClass) {
      res.status(mapping.status).json({ error: err.message, code: mapping.code });
      return;
    }
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error.", code: "INTERNAL_ERROR" });
}
