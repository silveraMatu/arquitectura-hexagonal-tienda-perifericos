import "dotenv/config";
import { createApp } from "./infrastructure/adapters/config/App.js";
import { DEFAULT_PORT } from "./infrastructure/adapters/config/constants.js";

const port = Number(process.env.PORT) || DEFAULT_PORT;
const app = createApp();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
