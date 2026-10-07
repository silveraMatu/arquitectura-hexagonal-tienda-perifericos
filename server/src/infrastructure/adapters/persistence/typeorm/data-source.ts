import { DataSource } from "typeorm";
import { ProductOrmEntity } from "./entities/ProductOrmEntity.js";
import { CartOrmEntity } from "./entities/CartOrmEntity.js";
import { CartItemOrmEntity } from "./entities/CartItemOrmEntity.js";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable "${name}".`);
  }
  return value;
}

/**
 * Reads process.env.* inside the function body (not at module scope) so it is only
 * evaluated after dotenv has loaded the root .env — ESM imports are hoisted before
 * index.ts's dotenv.config() runs, so a module-level read would see `undefined`.
 */
export function createDataSource(): DataSource {
  return new DataSource({
    type: "postgres",
    host: requireEnv("POSTGRES_HOST"),
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: requireEnv("POSTGRES_USER"),
    password: requireEnv("POSTGRES_PASSWORD"),
    database: requireEnv("POSTGRES_DB"),
    entities: [ProductOrmEntity, CartOrmEntity, CartItemOrmEntity],
    synchronize: true,
    logging: false,
  });
}
