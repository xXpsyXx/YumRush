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

const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173", // Local development
        process.env.FRONTEND_URL, // Primary Vercel URL
        process.env.PREVIEW_URL, // Preview deployments URL
      ].filter(Boolean); // Remove any undefined/empty values

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow any vercel.app subdomain during development/preview
      if (
        process.env.NODE_ENV !== "production" &&
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      // Check if the origin is allowed or matches a Vercel deployment URL pattern
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith(".vercel.app") ||
        !origin
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
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

// Start Express server normally on Railway
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
