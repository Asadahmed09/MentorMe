import { Request, Response } from "express";
import pool from "../config/database";
import { AuthRequest } from "../middleware/auth";

// GET all approved mentors (with their subjects)
export const getMentors = async (req: AuthRequest, res: Response) => {
  try {
    const requesterId = req.user?.id || 0;
    const result = await pool.query(
      `
      SELECT 
        u.id, u.name, u.email, u.univeristy, u.profile_image,
        mp.id as mentor_profile_id, mp.gpa, mp.bio, mp.experience,
        mp.average_rating, mp.total_ratings, mp.status,
        mp.show_email, mp.show_phone, mp.contact_visibility,
        ARRAY_REMOVE(ARRAY_AGG(s.name), NULL) as subjects,
        COALESCE(
          JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT('id', s.id, 'name', s.name)
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'::jsonb
        ) as subject_details
      FROM users u
      JOIN mentor_profiles mp ON u.id = mp.user_id
      LEFT JOIN mentor_subjects ms ON mp.id = ms.mentor_id
      LEFT JOIN subjects s ON ms.subject_id = s.id
      WHERE mp.status = 'approved' AND u.id != $1
      GROUP BY u.id, u.name, u.email, u.univeristy, u.profile_image,
               mp.id, mp.gpa, mp.bio, mp.experience,
               mp.average_rating, mp.total_ratings, mp.status,
               mp.show_email, mp.show_phone, mp.contact_visibility
      ORDER BY mp.average_rating DESC
    `,
      [requesterId],
    );

    return res.status(200).json({ mentors: result.rows });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// GET single mentor by id
export const getMentorById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        u.id, u.name, u.email, u.univeristy, u.profile_image,
        mp.id as mentor_profile_id, mp.gpa, mp.bio, mp.experience,
        mp.average_rating, mp.total_ratings, mp.status, mp.phone,
        mp.show_email, mp.show_phone, mp.contact_visibility,
        ARRAY_REMOVE(ARRAY_AGG(s.name), NULL) as subjects,
        COALESCE(
          JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT('id', s.id, 'name', s.name)
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'::jsonb
        ) as subject_details
      FROM users u
      JOIN mentor_profiles mp ON u.id = mp.user_id
      LEFT JOIN mentor_subjects ms ON mp.id = ms.mentor_id
      LEFT JOIN subjects s ON ms.subject_id = s.id
      WHERE u.id = $1 AND mp.status = 'approved'
      GROUP BY u.id, u.name, u.email, u.univeristy, u.profile_image,
               mp.id, mp.gpa, mp.bio, mp.experience,
               mp.average_rating, mp.total_ratings, mp.status, mp.phone,
               mp.show_email, mp.show_phone, mp.contact_visibility
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    return res.status(200).json({ mentor: result.rows[0] });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// POST apply as mentor (student applies)
export const applyAsMentor = async (req: any, res: Response) => {
  const { gpa, bio, experience, phone, subject_ids } = req.body;
  const userId = req.user.id;

  // GPA validation
  if (!gpa || parseFloat(gpa) > 4.0 || parseFloat(gpa) < 0) {
    return res.status(400).json({ message: "GPA must be between 0 and 4.0" });
  }

  // Subject limit
  if (!subject_ids || subject_ids.length === 0) {
    return res.status(400).json({ message: "Select at least one subject" });
  }
  if (subject_ids.length > 5) {
    return res.status(400).json({ message: "Maximum 5 subjects allowed" });
  }

  try {
    const existing = await pool.query(
      "SELECT id FROM mentor_profiles WHERE user_id = $1",
      [userId],
    );
    if (existing.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "You have already applied as mentor" });
    }

    // Check user is not admin
    const userCheck = await pool.query("SELECT role FROM users WHERE id = $1", [
      userId,
    ]);
    if (userCheck.rows[0]?.role === "admin") {
      return res.status(403).json({ message: "Admins cannot apply as mentor" });
    }

    const mp = await pool.query(
      `INSERT INTO mentor_profiles (user_id, gpa, bio, experience, phone, status)
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
      [userId, gpa, bio, experience, phone],
    );

    const mentorProfileId = mp.rows[0].id;

    for (const subjectId of subject_ids) {
      await pool.query(
        "INSERT INTO mentor_subjects (mentor_id, subject_id) VALUES ($1, $2)",
        [mentorProfileId, subjectId],
      );
    }

    return res.status(201).json({
      message: "Mentor application submitted successfully",
      mentorProfile: mp.rows[0],
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// GET current user's mentor status
export const getMyMentorStatus = async (req: any, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT status FROM mentor_profiles WHERE user_id = $1`,
      [req.user.id],
    );
    const status = result.rows.length > 0 ? result.rows[0].status : null;
    return res.json({ status });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// GET all subjects
export const getSubjects = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM subjects ORDER BY category, name",
    );
    return res.status(200).json({ subjects: result.rows });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// GET current mentor's subjects
export const getMySubjects = async (req: any, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.name, s.category
       FROM mentor_subjects ms
       JOIN subjects s ON ms.subject_id = s.id
       JOIN mentor_profiles mp ON ms.mentor_id = mp.id
       WHERE mp.user_id = $1 AND mp.status = 'approved'`,
      [req.user.id],
    );
    return res.json({ subjects: result.rows });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// POST add subject to approved mentor
export const addSubject = async (req: any, res: Response) => {
  const { subject_id } = req.body;
  const parsedSubjectId = Number(subject_id);
  if (!parsedSubjectId || Number.isNaN(parsedSubjectId)) {
    return res.status(400).json({ message: "subject_id is required" });
  }

  try {
    // Get mentor profile
    const mp = await pool.query(
      `SELECT id, status FROM mentor_profiles WHERE user_id = $1`,
      [req.user.id],
    );
    if (mp.rows.length === 0 || mp.rows[0].status !== "approved") {
      return res
        .status(403)
        .json({ message: "Only approved mentors can add subjects" });
    }

    const mentorProfileId = mp.rows[0].id;

    const subjectCheck = await pool.query(
      `SELECT id FROM subjects WHERE id = $1`,
      [parsedSubjectId],
    );
    if (subjectCheck.rows.length === 0) {
      return res.status(400).json({ message: "Subject not found" });
    }

    // Check total subjects count
    const count = await pool.query(
      `SELECT COUNT(*) FROM mentor_subjects WHERE mentor_id = $1`,
      [mentorProfileId],
    );
    if (parseInt(count.rows[0].count, 10) >= 5) {
      return res.status(400).json({ message: "Maximum 5 subjects allowed" });
    }

    // Check duplicate
    const duplicate = await pool.query(
      `SELECT id FROM mentor_subjects WHERE mentor_id = $1 AND subject_id = $2`,
      [mentorProfileId, parsedSubjectId],
    );
    if (duplicate.rows.length > 0) {
      return res.status(400).json({ message: "Subject already added" });
    }

    await pool.query(
      `INSERT INTO mentor_subjects (mentor_id, subject_id) VALUES ($1, $2)`,
      [mentorProfileId, parsedSubjectId],
    );

    return res.status(201).json({ message: "Subject added successfully" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
