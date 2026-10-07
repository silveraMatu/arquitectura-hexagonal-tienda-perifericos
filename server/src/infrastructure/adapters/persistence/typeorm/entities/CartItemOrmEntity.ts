import { Entity, PrimaryColumn, Column } from "typeorm";
import { numericTransformer } from "../transformers/numericTransformer.js";

/** Composite PK (cart_id, product_id): a cart has at most one line per product. */
@Entity({ name: "cart_items" })
export class CartItemOrmEntity {
  @PrimaryColumn({ name: "cart_id", type: "varchar", length: 255 })
  cartId!: string;

  @PrimaryColumn({ name: "product_id", type: "varchar", length: 255 })
  productId!: string;

  @Column({ name: "product_name", type: "varchar", length: 120 })
  productName!: string;

  @Column({ name: "unit_price", type: "numeric", precision: 10, scale: 2, transformer: numericTransformer })
  unitPrice!: number;

  @Column({ type: "integer" })
  quantity!: number;
}
