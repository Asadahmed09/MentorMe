import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../config/database";

export interface AuthRequest extends Request {
  user?: { id: number; role: string; email: string };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authenticateOptional = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  const token = authHeader.split(" ")[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeRole = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ message: "Access denied" });
    }
    try {
      const result = await pool.query("SELECT role FROM users WHERE id = $1", [
        req.user.id,
      ]);
      const dbRole = result.rows[0]?.role;
      const effectiveRole = dbRole || req.user.role;

      if (!effectiveRole || !roles.includes(effectiveRole)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user.role = effectiveRole;
      return next();
    } catch {
      return res.status(500).json({ message: "Server error" });
    }
  };
};
