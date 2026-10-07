import { Entity, PrimaryColumn, Column } from "typeorm";
import { numericTransformer } from "../transformers/numericTransformer.js";

@Entity({ name: "products" })
export class ProductOrmEntity {
  @PrimaryColumn({ type: "varchar", length: 255 })
  id!: string;

  @Column({ type: "varchar", length: 120 })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "numeric", precision: 10, scale: 2, transformer: numericTransformer })
  price!: number;

  @Column({ type: "integer" })
  stock!: number;
}
