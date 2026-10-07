import { Router } from "express";
import type { CartController } from "../controllers/CartController.js";

export function createCartRouter(controller: CartController): Router {
  const router = Router();

  router.post("/items", controller.addItem);
  router.delete("/items/undo", controller.undoLastAdd);
  router.delete("/items/:productId", controller.removeItem);
  router.post("/checkout", controller.checkout);

  return router;
}
