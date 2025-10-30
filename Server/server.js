import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { menus } from "./Views/Data/menu.js";
import { restaurants } from "./Views/Data/restaurants.js";
import { connectMongo } from "./db/connection.js";
import authRouter from "./auth/auth.routes.js";
import serverless from "serverless-http";

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static images under /images
app.use("/images", express.static(path.join(__dirname, "public", "images")));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/api/menus", (req, res) => {
  res.json(menus);
});

app.get("/api/restaurants", (req, res) => {
  res.json(restaurants);
});

// --- Mongo connection ---
// connectMongo may establish a DB connection; for serverless environments we
// call it at import time so cold starts initialize DB connectivity. Ensure
// this function is resilient to repeated calls.
await connectMongo();

// --- Auth routes ---
app.use("/api/auth", authRouter);

// When running locally as a standalone server, set RUN_SERVER=true
if (process.env.RUN_SERVER === "true") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export serverless handler for Vercel and other platforms
export const handler = serverless(app);
export default app;
