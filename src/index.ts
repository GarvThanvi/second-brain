import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import connectDB from "./db.js";
import User from "./models/user.model.js";
import * as z from "zod";
import { authMiddleware } from "./middleware.js";
dotenv.config();

const app = express();
connectDB();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

app.post("/api/v1/content", authMiddleware,  (req, res) => {
  //@ts-ignore
  console.log(req.userId);
});
app.get("/api/v1/content", (req, res) => {});
app.delete("/api/v1/content", (req, res) => {});
app.post("/api/v1/brain/share", (req, res) => {});
app.get("/api/v1/brain/:shareLink", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
