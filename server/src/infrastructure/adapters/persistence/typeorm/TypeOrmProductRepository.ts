import type { DataSource, Repository } from "typeorm";
import type {
  ProductRepositoryPort,
  ProductSearchCriteria,
} from "../../../../domain/ports/ProductRepositoryPort.js";
import type { Product } from "../../../../domain/entities/Product.js";
import type { ProductId } from "../../../../domain/value-objects/ProductId.js";
import { ProductOrmEntity } from "./entities/ProductOrmEntity.js";
import { toDomainProduct, toProductOrmEntity } from "./mappers/ProductOrmMapper.js";

export class TypeOrmProductRepository implements ProductRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private get repo(): Repository<ProductOrmEntity> {
    return this.dataSource.getRepository(ProductOrmEntity);
  }

  async findById(id: ProductId): Promise<Product | null> {
    const row = await this.repo.findOneBy({ id: id.value });
    return row ? toDomainProduct(row) : null;
  }

  async findAll(): Promise<Product[]> {
    const rows = await this.repo.find();
    return rows.map(toDomainProduct);
  }

  async search(criteria: ProductSearchCriteria): Promise<Product[]> {
    const qb = this.repo.createQueryBuilder("p");

    if (criteria.name) {
      qb.andWhere("LOWER(p.name) LIKE LOWER(:name)", { name: `%${criteria.name}%` });
    }
    if (criteria.minPrice !== undefined) {
      qb.andWhere("p.price >= :minPrice", { minPrice: criteria.minPrice });
    }
    if (criteria.maxPrice !== undefined) {
      qb.andWhere("p.price <= :maxPrice", { maxPrice: criteria.maxPrice });
    }

    const rows = await qb.getMany();
    return rows.map(toDomainProduct);
  }

  async save(product: Product): Promise<void> {
    await this.repo.save(toProductOrmEntity(product));
  }
}
