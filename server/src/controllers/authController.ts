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
       VALUES ($1,$2,$3,$4,'Fast NUCES') RETURNING id, name, email, role, univeristy, profile_image, phone, whatsapp_number, linkedin_url, github_url, website_url, created_at`,
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
      "SELECT id, name, email, role, univeristy, profile_image, phone, whatsapp_number, linkedin_url, github_url, website_url, created_at FROM users WHERE id=$1",
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

export const updateMe = async (req: any, res: Response) => {
  const {
    name,
    phone,
    whatsapp_number,
    linkedin_url,
    github_url,
    website_url,
    show_email,
    show_phone,
    contact_visibility,
  } = req.body;

  const normalizedName = typeof name === "string" ? name.trim() : "";
  if (!normalizedName) {
    return res.status(400).json({ message: "Name cannot be empty" });
  }

  const normalizeContact = (value: unknown) => {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `UPDATE users SET
        name = $1,
        phone = $2,
        whatsapp_number = $3,
        linkedin_url = $4,
        github_url = $5,
        website_url = $6
       WHERE id = $7
       RETURNING id, name, email, role, univeristy, profile_image, phone, whatsapp_number, linkedin_url, github_url, website_url, created_at`,
      [
        normalizedName,
        normalizeContact(phone),
        normalizeContact(whatsapp_number),
        normalizeContact(linkedin_url),
        normalizeContact(github_url),
        normalizeContact(website_url),
        req.user.id,
      ],
    );

    if (!userResult.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "User not found" });
    }

    let mentorProfile = null;
    if (userResult.rows[0].role === "mentor") {
      const mentorResult = await client.query(
        `UPDATE mentor_profiles
         SET phone = COALESCE($1, phone),
             show_email = COALESCE($2, show_email),
             show_phone = COALESCE($3, show_phone),
             contact_visibility = COALESCE($4, contact_visibility)
         WHERE user_id = $5
         RETURNING *`,
        [
          normalizeContact(phone),
          show_email,
          show_phone,
          contact_visibility,
          req.user.id,
        ],
      );
      mentorProfile = mentorResult.rows[0] || null;
    }

    await client.query("COMMIT");
    return res.json({
      message: "Profile updated successfully",
      user: userResult.rows[0],
      mentorProfile,
    });
  } catch (err: any) {
    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  } finally {
    client.release();
  }
};
