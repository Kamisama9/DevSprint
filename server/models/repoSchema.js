import mongoose from "mongoose";

const repoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  repo_url: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  commits: [
    {
      message: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Repo", repoSchema);
