import "reflect-metadata";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// The real .env lives at the repo root, not inside server/. src/index.ts and dist/index.js
// are both two levels below the root, so the same relative path resolves in dev and in build.
// In Docker there is no repo-root .env at all — docker-compose injects env vars directly
// into process.env, so this is skipped rather than logging a spurious "file not found".
const rootEnvPath = path.resolve(__dirname, "../../.env");
if (existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}

const { createDataSource } = await import("./infrastructure/adapters/persistence/typeorm/data-source.js");
const { createApp } = await import("./infrastructure/adapters/config/App.js");
const { DEFAULT_PORT } = await import("./infrastructure/adapters/config/constants.js");
const { TypeOrmProductRepository } = await import(
  "./infrastructure/adapters/persistence/typeorm/TypeOrmProductRepository.js"
);
const { seedProductsIfEmpty } = await import("./infrastructure/adapters/persistence/typeorm/seedDatabase.js");

async function bootstrap(): Promise<void> {
  const dataSource = createDataSource();
  await dataSource.initialize();
  console.log("Data source initialized.");

  await seedProductsIfEmpty(new TypeOrmProductRepository(dataSource));

  const port = Number(process.env.PORT) || DEFAULT_PORT;
  const app = createApp(dataSource);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
