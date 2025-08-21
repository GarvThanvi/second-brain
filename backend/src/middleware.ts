import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt, { type JwtPayload } from "jsonwebtoken";
dotenv.config();

interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {

    const token: string = req.headers.authorization?.split(" ")[1] as string;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded: JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: "Bad Request" });
  }
};
