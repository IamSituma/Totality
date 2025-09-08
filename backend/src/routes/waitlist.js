import express from "express";
import pool from "../db.js";

const router = express.Router();

const emailRegex = /^\S+@\S+\.\S+$/;

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    const normalized = email.toLowerCase().trim();
    const query = `
      INSERT INTO waitlist (email)
      VALUES ($1)
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email, created_at
    `;
    const result = await pool.query(query, [normalized]);

    if (result.rowCount === 0) {
      return res.status(200).json({ message: "Email already registered" });
    }
    res.status(201).json({ message: "Added to waitlist", entry: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, email, created_at FROM waitlist ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
