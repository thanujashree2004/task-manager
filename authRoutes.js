const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
router.post("/register", (req, res) => {
  const { name, email, password, role, organization_id } = req.body;

  const sql =
    "INSERT INTO users (name, email, password, role, organization_id) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [name, email, password, role, organization_id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "User registered successfully" });
  });
});

// ================= LOGIN (FIXED) =================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = results[0];

    // ✅ FIX: plain password comparison (because DB is not hashed)
    if (password !== user.password) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        orgId: user.organization_id
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
});

module.exports = router;