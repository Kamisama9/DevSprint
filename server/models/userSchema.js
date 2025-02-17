import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    repos_url: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    repos: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Repo",
      },
    ],
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("User", userSchema);
