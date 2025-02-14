import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  repos: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Repo",
    },
  ],
});
export default mongoose.model("User", userSchema);
