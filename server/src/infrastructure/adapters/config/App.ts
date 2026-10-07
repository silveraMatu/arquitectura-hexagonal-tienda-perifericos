import express, { type Express } from "express";
import cors from "cors";
import type { DataSource } from "typeorm";
import { buildContainer } from "./container.js";
import { createProductRouter } from "../api/routes/productRoutes.js";
import { createCartRouter } from "../api/routes/cartRoutes.js";
import { notFoundHandler } from "../api/middlewares/notFoundHandler.js";
import { errorHandler } from "../api/middlewares/errorHandler.js";

export function createApp(dataSource: DataSource): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const { productController, cartController } = buildContainer(dataSource);

  app.use("/products", createProductRouter(productController));
  app.use("/cart", createCartRouter(cartController));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
