// Vercel serverless entrypoint that re-uses the express app from the Server
// directory. This file keeps the Vercel function surface small and stable.
import { handler } from "../server.js";

export default handler;
