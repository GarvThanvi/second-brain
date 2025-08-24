import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import connectDB from "./db.js";
import User from "./models/user.model.js";
import * as z from "zod";
import { authMiddleware } from "./middleware.js";
import Content from "./models/content.model.js";
import Tag from "./models/tag.model.js";
import * as crypto from "crypto";
import mongoose from "mongoose";
import Link from "./models/link.model.js";
import cors from "cors"
dotenv.config();

const app = express();
connectDB();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username too short")
    .max(10, "Username too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(20, "Password must be at most 20 characters.")
    .refine((v) => /^\S+$/.test(v), "Password must not contain spaces.")
    .refine(
      (v) => /[a-z]/.test(v),
      "Must include at least one lowercase letter."
    )
    .refine(
      (v) => /[A-Z]/.test(v),
      "Must include at least one uppercase letter."
    )
    .refine((v) => /\d/.test(v), "Must include at least one number.")
    .refine(
      (v) => /[^\w\s]/.test(v),
      "Must include at least one special character."
    ),
});

const signinSchema = z.object({
  username: z.string().min(3).max(10),
  password: z.string().min(1, "Password is required"),
});

type UserType = z.infer<typeof signUpSchema>;

app.post("/api/v1/signup", async (req, res) => {
  try {
    const result: any = signUpSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(411).json({
        success: false,
        message: result.error.issues[0].message,
      });
    }
    const userData: UserType = result.data;

    const userExists = await User.findOne({ username: userData.username });
    if (userExists) {
      return res
        .status(403)
        .json({ success: false, message: "Username already exists" });
    }

    const hashedPassword: string = await bcrypt.hash(userData.password, 10);

    await User.create({
      username: userData.username,
      password: hashedPassword,
    });

    return res
      .status(200)
      .json({ success: true, message: "User Signup successfully" });
  } catch (error) {
    console.error("Error while user signup", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error while sign up" });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  try {
    const result = signinSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(411).json({
        success: false,
        message: "Incorrect username or password format",
      });
    }

    const userData: UserType = result.data;

    const userExists = await User.findOne({ username: userData.username });
    if (!userExists) {
      return res
        .status(401)
        .json({ success: false, message: "Wrong email or password" });
    }

    const isMatch = await bcrypt.compare(
      userData.password,
      userExists.password
    );
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Wrong email or password" });
    }

    const token = jwt.sign(
      {
        id: userExists._id,
      },
      process.env.JWT_SECRET as string
    );

    return res.status(200).json({
      success: true,
      message: "User signed in successfully",
      user: userData.username,
      token,
    });
  } catch (error) {
    console.error("Server error while signing in ", error);
    return res.status(500).json({
      success: false,
      message: "Server error while signing in",
    });
  }
});

interface contentInterface {
  type: string;
  link: string;
  title: string;
  tags: string[];
}

app.post("/api/v1/content", authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  try {
    const { type, link, title, tags } = req.body as contentInterface;

    if (!type || !link || !title || !tags) {
      return res
        .status(411)
        .json({ success: false, message: "Some fields are missing" });
    }

    const tagIds: mongoose.Types.ObjectId[] = [];
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        let tagDoc = await Tag.findOne({ title: tag });
        if (!tagDoc) {
          tagDoc = await Tag.create({ title: tag });
        }
        tagIds.push(tagDoc._id);
      }
    }

    await Content.create({
      type,
      link,
      title,
      tags: tagIds,
      userId,
    });

    return res.status(200).json({ success: true, message: "Content Created" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error while creating content" });
  }
});

app.get("/api/v1/content", authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  try {
    const contentDocs = await Content.find({ userId }).populate("tags", "title");

    return res.status(200).json({
      success: true,
      message: "All Content retrieved successfully",
      contents: contentDocs,
    });
  } catch (error) {
    console.error("Server error while fetching all contents", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching all contents",
    });
  }
});

app.delete("/api/v1/content", authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  try {
    const { contentId } = req.body;

    const contentDoc = await Content.findOne({
      $and: [{ _id: contentId }, { userId }],
    });
    if (!contentDoc) {
      return res
        .status(404)
        .json({ success: false, message: "No such content found to delete" });
    }

    await Content.deleteOne({
      $and: [{ _id: contentId }, { userId }],
    });

    return res.status(200).json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("Server error while deleting content", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting content",
    });
  }
});

app.post("/api/v1/brain/share", authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const share = req.body.share;
  try {
    const contentDocs = await Content.find({ userId });
    if (!contentDocs || contentDocs.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No content to share" });
    }

    if (share) {
      const existingLink = await Link.findOne({ userId });
      if (existingLink) {
        return res.status(200).json({
          success: true,
          message: "Share link generated",
          link: `${process.env.FRONTEND_URL}/share/${existingLink.hash}`,
        });
      }

      const token = crypto.randomUUID();
      await Link.create({
        hash: token,
        userId: userId,
      });
      return res.status(200).json({
        success: true,
        message: "Share link generated",
        link: `${process.env.FRONTEND_URL}/share/${token}`,
      });
    } else {
      await Link.deleteOne({ userId });
      return res.status(200).json({
        success: true,
        mesage: "Sharing of brain stopped",
      });
    }
  } catch (error) {
    console.error("Server error while generating share link ", error);
    return res.status(500).json({
      success: false,
      message: "Server error while generating share link",
    });
  }
});

app.get("/api/v1/brain/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const link = await Link.findOne({ hash: token }).populate(
      "userId",
      "username"
    );

    if (!link) {
      return res
        .status(404)
        .json({ success: false, message: "No such brain exists" });
    }

    //@ts-ignore
    const contentDocs = await Content.find({ userId: link.userId._id }).populate("tags", "title");

    return res.status(200).json({
      success: true,
      message: "Shared brain retrieved successfully",
      //@ts-ignore
      data: { username: link.userId.username, content: contentDocs },
    });
  } catch (error) {
    console.error("Server error while fetching shared brain", error);
    return res
      .status(500)
      .json({ success: false, message: "Server while fetching shared brain" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
