import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await pool.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    if (existing.rows.length)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, univeristy)
       VALUES ($1,$2,$3,$4,'Fast NUCES') RETURNING id, name, email, role, univeristy, created_at`,
      [name, email, hashed, role || "student"],
    );
    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );
    return res.status(201).json({ token, user });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (!result.rows.length)
      return res.status(400).json({ message: "Invalid email or password" });

    const user = result.rows[0];
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid email or password" });

    let mentorProfile = null;
    if (user.role === "mentor") {
      const mp = await pool.query(
        "SELECT * FROM mentor_profiles WHERE user_id=$1",
        [user.id],
      );
      mentorProfile = mp.rows[0] || null;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );
    const { password: _, ...safeUser } = user;
    return res.json({ token, user: safeUser, mentorProfile });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  const { admin_id, password } = req.body;
  try {
    // Admin credentials - in production, these should be more secure
    const adminUser = {
      id: 1,
      name: "Admin",
      email: "admin@mentorme.com",
      role: "admin",
      univeristy: "Admin Panel",
    };

    // Simple admin ID and password check (in production, use a proper admin table)
    if (admin_id !== "admin" || password !== "admin123") {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { id: adminUser.id, role: adminUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    return res.json({
      token,
      user: adminUser,
      mentorProfile: null,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, univeristy, profile_image, created_at FROM users WHERE id=$1",
      [req.user.id],
    );
    if (!result.rows.length)
      return res.status(404).json({ message: "User not found" });

    const user = result.rows[0];
    let mentorProfile = null;
    if (user.role === "mentor") {
      const mp = await pool.query(
        "SELECT * FROM mentor_profiles WHERE user_id=$1",
        [user.id],
      );
      mentorProfile = mp.rows[0] || null;
    }
    return res.json({ user, mentorProfile });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
