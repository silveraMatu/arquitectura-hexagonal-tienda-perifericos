import { Router } from "express";
import type { ProductController } from "../controllers/ProductController.js";

export function createProductRouter(controller: ProductController): Router {
  const router = Router();

  router.get("/search", controller.search);
  router.get("/:id", controller.getDetail);
  router.get("/", controller.list);

  return router;
}
