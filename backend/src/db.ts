import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_STRING as string);
    console.log("Connected to Database");
  } catch (error) {
    console.error("Error :", error);
  }
};

export default connectDB;
