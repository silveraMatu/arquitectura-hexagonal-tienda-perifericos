export interface CartItemResponseDTO {
  readonly productId: string;
  readonly productName: string;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly subtotal: number;
}

export interface CartResponseDTO {
  readonly cartId: string;
  readonly items: readonly CartItemResponseDTO[];
  readonly total: number;
  readonly isEmpty: boolean;
}

export interface AddItemToCartRequestDTO {
  readonly cartId: string;
  readonly productId: string;
  readonly quantity: number;
}

export type RemoveItemFromCartRequestDTO =
  | { readonly cartId: string; readonly mode: "undo" }
  | { readonly cartId: string; readonly mode: "removeById"; readonly productId: string };

export interface CheckoutRequestDTO {
  readonly cartId: string;
}

export interface CheckoutResponseDTO {
  readonly cartId: string;
  readonly purchasedItems: readonly CartItemResponseDTO[];
  readonly total: number;
}
