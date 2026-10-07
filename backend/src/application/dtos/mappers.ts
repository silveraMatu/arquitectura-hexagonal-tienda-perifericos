import type { Product } from "../../domain/entities/Product.js";
import type { Cart } from "../../domain/entities/Cart.js";
import type { CartItem } from "../../domain/entities/CartItem.js";
import type { ProductResponseDTO } from "./ProductDTOs.js";
import type { CartItemResponseDTO, CartResponseDTO } from "./CartDTOs.js";

export function toProductResponse(product: Product): ProductResponseDTO {
  return {
    id: product.id.value,
    name: product.name.value,
    description: product.description,
    price: product.price.value,
    stock: product.stock.value,
  };
}

export function toCartItemResponse(item: CartItem): CartItemResponseDTO {
  return {
    productId: item.productId.value,
    productName: item.productName.value,
    unitPrice: item.unitPrice.value,
    quantity: item.quantity.value,
    subtotal: item.subtotal().value,
  };
}

export function toCartResponse(cart: Cart): CartResponseDTO {
  return {
    cartId: cart.id.value,
    items: cart.items.map(toCartItemResponse),
    total: cart.getTotal().value,
    isEmpty: cart.isEmpty(),
  };
}
