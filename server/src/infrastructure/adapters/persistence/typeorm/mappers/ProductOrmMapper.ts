import { Product } from "../../../../../domain/entities/Product.js";
import { ProductId } from "../../../../../domain/value-objects/ProductId.js";
import { ProductName } from "../../../../../domain/value-objects/ProductName.js";
import { Price } from "../../../../../domain/value-objects/Price.js";
import { Stock } from "../../../../../domain/value-objects/Stock.js";
import { ProductOrmEntity } from "../entities/ProductOrmEntity.js";

export function toDomainProduct(row: ProductOrmEntity): Product {
  return new Product({
    id: new ProductId(row.id),
    name: new ProductName(row.name),
    description: row.description,
    price: new Price(row.price),
    stock: new Stock(row.stock),
  });
}

export function toProductOrmEntity(product: Product): ProductOrmEntity {
  const row = new ProductOrmEntity();
  row.id = product.id.value;
  row.name = product.name.value;
  row.description = product.description;
  row.price = product.price.value;
  row.stock = product.stock.value;
  return row;
}
