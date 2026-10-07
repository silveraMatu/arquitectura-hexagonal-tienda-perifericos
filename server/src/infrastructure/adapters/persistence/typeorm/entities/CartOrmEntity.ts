import { Entity, PrimaryColumn, Column } from "typeorm";

export interface SerializedHistoryEntry {
  productId: string;
  quantityAdded: number;
}

@Entity({ name: "carts" })
export class CartOrmEntity {
  @PrimaryColumn({ type: "varchar", length: 255 })
  id!: string;

  /** LIFO undo stack (Cart._history). Never exposed in any DTO/response. */
  @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
  history!: SerializedHistoryEntry[];
}
