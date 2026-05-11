import { Request, Response } from "express";
import pool from "../config/database";

export const getPendingMentors = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.email, u.univeristy,
             mp.id as mentor_profile_id, mp.gpa, mp.bio,
             mp.experience, mp.status, mp.created_at,
             ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) as subjects
      FROM users u
      JOIN mentor_profiles mp ON u.id = mp.user_id
      LEFT JOIN mentor_subjects ms ON mp.id = ms.mentor_id
      LEFT JOIN subjects s ON ms.subject_id = s.id
      WHERE mp.status = 'pending'
      GROUP BY u.id, mp.id
      ORDER BY mp.created_at ASC
    `);
    return res.json({ applications: result.rows });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const approveMentor = async (req: any, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;
  try {
    const mentor = await pool.query(
      `SELECT user_id FROM mentor_profiles WHERE id = $1`,
      [id],
    );
    if (!mentor.rows.length)
      return res.status(404).json({ message: "Not found" });

    await pool.query(
      `UPDATE mentor_profiles SET status='approved', is_verified=true,
       verified_at=NOW(), verified_by=$1, verification_notes=$2 WHERE id=$3`,
      [req.user.id, notes || null, id],
    );
    await pool.query(`UPDATE users SET role='mentor' WHERE id=$1`, [
      mentor.rows[0].user_id,
    ]);

    return res.json({ message: "Mentor approved" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const rejectMentor = async (req: any, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;
  try {
    await pool.query(
      `UPDATE mentor_profiles SET status='rejected', verified_by=$1, verification_notes=$2 WHERE id=$3`,
      [req.user.id, notes || null, id],
    );
    return res.json({ message: "Mentor rejected" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM platform_stats`);
    return res.json({ stats: result.rows[0] });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
