import mongoose from "mongoose";
import User from "./user.model.js";
const contentTypes = ["image", "youtube", "article", "audio", "twitter", "post"];

const contentSchema = new mongoose.Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

contentSchema.pre("save", async function (next) {
  const user = await User.findById(this.userId);
  if (!user) {
    throw new Error("User does not exist");
  }
  next();
});

const Content = mongoose.model("Content", contentSchema);
export default Content;
