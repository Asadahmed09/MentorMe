import { Request, Response } from "express";
import pool from "../config/database";

// POST - Student sends a mentorship request
export const createRequest = async (req: any, res: Response) => {
  const { mentor_id, subject_id, message } = req.body;
  const student_id = req.user.id;

  try {
    // Check if already sent a pending request to same mentor
    const existing = await pool.query(
      `SELECT id FROM mentorship_requests 
       WHERE student_id = $1 AND mentor_id = $2 AND status = 'pending'`,
      [student_id, mentor_id],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "You already have a pending request with this mentor",
      });
    }

    const result = await pool.query(
      `INSERT INTO mentorship_requests (student_id, mentor_id, subject_id, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [student_id, mentor_id, subject_id, message],
    );

    return res.status(201).json({
      message: "Request sent successfully",
      request: result.rows[0],
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// GET - Student sees their own requests
export const getMyRequestsAsStudent = async (req: any, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
        mr.id, mr.mentor_id, mr.message, mr.status, mr.created_at, mr.updated_at,
        u.name as mentor_name, u.email as mentor_email, u.profile_image as mentor_image,
        s.name as subject_name,
        mp.phone as mentor_phone,
        mp.show_email, mp.show_phone, mp.contact_visibility
       FROM mentorship_requests mr
       JOIN mentor_profiles mp ON mr.mentor_id = mp.id
       JOIN users u ON mp.user_id = u.id
       JOIN subjects s ON mr.subject_id = s.id
       WHERE mr.student_id = $1
       ORDER BY mr.created_at DESC`,
      [req.user.id],
    );

    return res.status(200).json({ requests: result.rows });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// GET - Mentor sees requests sent to them
export const getMyRequestsAsMentor = async (req: any, res: Response) => {
  try {
    // Get mentor_profile id first
    const mp = await pool.query(
      "SELECT id FROM mentor_profiles WHERE user_id = $1",
      [req.user.id],
    );

    if (mp.rows.length === 0) {
      return res.status(404).json({ message: "Mentor profile not found" });
    }

    const mentorProfileId = mp.rows[0].id;

    const result = await pool.query(
      `SELECT 
        mr.id, mr.message, mr.status, mr.created_at, mr.updated_at,
        u.name as student_name, u.email as student_email,
        u.profile_image as student_image, u.univeristy,
        s.name as subject_name
       FROM mentorship_requests mr
       JOIN users u ON mr.student_id = u.id
       JOIN subjects s ON mr.subject_id = s.id
       WHERE mr.mentor_id = $1
       ORDER BY mr.created_at DESC`,
      [mentorProfileId],
    );

    return res.status(200).json({ requests: result.rows });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// PUT - Mentor accepts or rejects a request
export const updateRequestStatus = async (req: any, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'accepted' or 'rejected'

  if (!["accepted", "rejected"].includes(status)) {
    return res
      .status(400)
      .json({ message: "Status must be accepted or rejected" });
  }

  try {
    // Make sure this request belongs to this mentor
    const mp = await pool.query(
      "SELECT id FROM mentor_profiles WHERE user_id = $1",
      [req.user.id],
    );

    if (mp.rows.length === 0) {
      return res.status(404).json({ message: "Mentor profile not found" });
    }

    const result = await pool.query(
      `UPDATE mentorship_requests 
       SET status = $1, updated_at = NOW()
       WHERE id = $2 AND mentor_id = $3
       RETURNING *`,
      [status, id, mp.rows[0].id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.status(200).json({
      message: `Request ${status} successfully`,
      request: result.rows[0],
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// POST - Student submits a rating after completed request
export const submitRating = async (req: any, res: Response) => {
  const { request_id, score, review } = req.body;
  const student_id = req.user.id;

  try {
    // Verify request is completed and belongs to this student
    const reqCheck = await pool.query(
      `SELECT * FROM mentorship_requests 
       WHERE id = $1 AND student_id = $2 AND status = 'completed'`,
      [request_id, student_id],
    );

    if (reqCheck.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Request not found or not completed" });
    }

    const mentorshipReq = reqCheck.rows[0];

    // Insert rating
    await pool.query(
      `INSERT INTO ratings (student_id, mentor_id, request_id, score, review)
       VALUES ($1, $2, $3, $4, $5)`,
      [student_id, mentorshipReq.mentor_id, request_id, score, review],
    );

    // Update mentor average rating
    await pool.query(
      `UPDATE mentor_profiles SET
        average_rating = (
          SELECT AVG(score) FROM ratings WHERE mentor_id = $1
        ),
        total_ratings = (
          SELECT COUNT(*) FROM ratings WHERE mentor_id = $1
        )
       WHERE id = $1`,
      [mentorshipReq.mentor_id],
    );

    return res.status(201).json({ message: "Rating submitted successfully" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
