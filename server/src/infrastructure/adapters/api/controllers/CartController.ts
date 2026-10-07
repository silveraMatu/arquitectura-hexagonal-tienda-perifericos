import type { Request, Response } from "express";
import { z } from "zod";
import type { GetCartUseCase } from "../../../../application/use-cases/GetCartUseCase.js";
import type { AddItemToCartUseCase } from "../../../../application/use-cases/AddItemToCartUseCase.js";
import type { RemoveItemFromCartUseCase } from "../../../../application/use-cases/RemoveItemFromCartUseCase.js";
import type { CheckoutUseCase } from "../../../../application/use-cases/CheckoutUseCase.js";
import { DEFAULT_CART_ID } from "../../config/constants.js";

const addItemBodySchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.number().int().positive(),
  cartId: z.string().trim().min(1).optional(),
});

const cartIdQuerySchema = z.object({
  cartId: z.string().trim().min(1).optional(),
});

const removeByIdParamSchema = z.object({
  productId: z.string().trim().min(1),
});

const checkoutBodySchema = z.object({
  cartId: z.string().trim().min(1).optional(),
});

export class CartController {
  constructor(
    private readonly getCartUseCase: GetCartUseCase,
    private readonly addItemToCartUseCase: AddItemToCartUseCase,
    private readonly removeItemFromCartUseCase: RemoveItemFromCartUseCase,
    private readonly checkoutUseCase: CheckoutUseCase,
  ) {}

  getCart = async (req: Request, res: Response): Promise<void> => {
    const query = cartIdQuerySchema.parse(req.query);
    const cart = await this.getCartUseCase.execute({
      cartId: query.cartId ?? DEFAULT_CART_ID,
    });
    res.status(200).json(cart);
  };

  addItem = async (req: Request, res: Response): Promise<void> => {
    const body = addItemBodySchema.parse(req.body ?? {});
    const cart = await this.addItemToCartUseCase.execute({
      cartId: body.cartId ?? DEFAULT_CART_ID,
      productId: body.productId,
      quantity: body.quantity,
    });
    res.status(200).json(cart);
  };

  undoLastAdd = async (req: Request, res: Response): Promise<void> => {
    const query = cartIdQuerySchema.parse(req.query);
    const cart = await this.removeItemFromCartUseCase.execute({
      cartId: query.cartId ?? DEFAULT_CART_ID,
      mode: "undo",
    });
    res.status(200).json(cart);
  };

  removeItem = async (req: Request, res: Response): Promise<void> => {
    const params = removeByIdParamSchema.parse(req.params);
    const query = cartIdQuerySchema.parse(req.query);
    const cart = await this.removeItemFromCartUseCase.execute({
      cartId: query.cartId ?? DEFAULT_CART_ID,
      mode: "removeById",
      productId: params.productId,
    });
    res.status(200).json(cart);
  };

  checkout = async (req: Request, res: Response): Promise<void> => {
    const body = checkoutBodySchema.parse(req.body ?? {});
    const result = await this.checkoutUseCase.execute({
      cartId: body.cartId ?? DEFAULT_CART_ID,
    });
    res.status(200).json(result);
  };
}
