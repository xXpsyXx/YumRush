import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import { menus } from "./Views/Data/menu.js";
import { restaurants } from "./Views/Data/restaurants.js";
import { connectMongo } from "./db/connection.js";
import authRouter from "./auth/auth.routes.js";

const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable compression for all responses (gzip)
app.use(compression({ level: 6 }));

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

// Serve static images under /images with aggressive caching
const imagesStatic = express.static(path.join(__dirname, "public", "images"), {
  maxAge: "1y", // Cache for 1 year
  etag: true,
  lastModified: true,
  immutable: true,
});

app.use(
  "/images",
  (req, res, next) => {
    // Set cache headers for images
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  },
  imagesStatic
);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/api/menus", (req, res) => {
  // Cache API responses for 5 minutes
  res.setHeader("Cache-Control", "public, max-age=300");
  res.json(menus);
});

app.get("/api/restaurants", (req, res) => {
  // Cache API responses for 5 minutes
  res.setHeader("Cache-Control", "public, max-age=300");
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
if (PORT) {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

// Export handler for Vercel serverless
export const handler = app;
