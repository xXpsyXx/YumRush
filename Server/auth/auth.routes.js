import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./user.model.js";
import { Order } from "./order.model.js";

const router = Router();

function dbConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });
    if (!dbConfigured())
      return res.status(503).json({ message: "Database not configured" });
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "Email in use" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });
    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email, name: user.name },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });
    if (!dbConfigured())
      return res.status(503).json({ message: "Database not configured" });

    const emailLower = email.toLowerCase();

    // First: Check if email exists in database
    const user = await User.findOne({ email: emailLower });

    // If email doesn't exist in database, tell user to register
    // MUST check this BEFORE attempting to check password
    if (user === null || user === undefined || !user) {
      return res.status(401).json({
        message: "Email not found. Please register to create an account.",
      });
    }

    // Email exists, now check password
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      // Email exists but password is wrong - say Invalid credentials
      console.log("Login failed: Wrong password for email -", emailLower);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email, name: user.name },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ message: "Login failed" });
  }
});

// Place order: requires Authorization: Bearer <token>
router.post("/orders", async (req, res) => {
  try {
    console.log("Order POST received:", {
      hasBody: !!req.body,
      bodyKeys: req.body ? Object.keys(req.body) : [],
      contentType: req.headers["content-type"],
      hasAuth: !!req.headers.authorization,
    });

    const auth = (req.headers.authorization || "").split(" ");
    if (auth[0] !== "Bearer" || !auth[1]) {
      console.log("Order POST: Missing or invalid authorization header");
      return res.status(401).json({ message: "Unauthorized" });
    }

    let payload;
    try {
      payload = jwt.verify(auth[1], process.env.JWT_SECRET || "dev-secret");
      console.log("Order POST: Token verified for userId:", payload.sub);
    } catch (tokenError) {
      console.log("Order POST: Token verification failed:", tokenError.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    const { items, total } = req.body || {};
    console.log("Order POST: Parsed body:", {
      items: items ? `${items.length} items` : "missing",
      total,
      itemsType: Array.isArray(items) ? "array" : typeof items,
      totalType: typeof total,
    });

    if (!Array.isArray(items) || !items.length || typeof total !== "number") {
      console.log("Order POST: Invalid payload", {
        isArray: Array.isArray(items),
        hasLength: items?.length,
        totalIsNumber: typeof total === "number",
      });
      return res.status(400).json({ message: "Invalid order payload" });
    }

    if (!dbConfigured()) {
      console.log("Order POST: Database not configured");
      return res.status(503).json({ message: "Database not configured" });
    }

    console.log("Order POST: Creating order in database...");
    const order = await Order.create({ userId: payload.sub, items, total });
    console.log("Order POST: Order created successfully:", {
      id: order._id,
      userId: order.userId,
      itemsCount: order.items.length,
      total: order.total,
    });

    res.json({ id: order._id, createdAt: order.createdAt });
  } catch (e) {
    console.error("Order POST: Error creating order:", e);
    res
      .status(500)
      .json({ message: "Failed to place order", error: e.message });
  }
});

// List orders for current user
router.get("/orders", async (req, res) => {
  try {
    const auth = (req.headers.authorization || "").split(" ");
    if (auth[0] !== "Bearer" || !auth[1])
      return res.status(401).json({ message: "Unauthorized" });
    let payload;
    try {
      payload = jwt.verify(auth[1], process.env.JWT_SECRET || "dev-secret");
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
    const orders = await Order.find({ userId: payload.sub })
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Update current user: change name and/or password
router.patch("/me", async (req, res) => {
  try {
    const auth = (req.headers.authorization || "").split(" ");
    if (auth[0] !== "Bearer" || !auth[1])
      return res.status(401).json({ message: "Unauthorized" });
    let payload;
    try {
      payload = jwt.verify(auth[1], process.env.JWT_SECRET || "dev-secret");
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
    const { name, currentPassword, newPassword } = req.body || {};
    const user = await User.findById(payload.sub);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }
    if (newPassword) {
      if (!currentPassword)
        return res.status(400).json({ message: "Current password required" });
      const ok = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!ok)
        return res.status(401).json({ message: "Current password incorrect" });
      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }
    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;
