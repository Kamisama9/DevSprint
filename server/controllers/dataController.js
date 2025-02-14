import User from '../models/userSchema.js';
import Repo from "../models/repoSchema.js";

// Find or create a user based on user data
const findOrCreateUser = async (userData) => {
  try {
    let user = await User.findOne({ username: userData.username });

    if (!user) {
      user = new User({
        username: userData.username, 
        name: userData.name || "",
        repos: [],
      });
      await user.save();
    }

    return user;
  } catch (error) {
    console.error("Error finding or creating user:", error);
    throw new Error("Error saving user data");
  }
};

// Get or create repository details and save commits
const getRepoDetails = async (repo, commits) => {
  try {
    let repoDetails = await Repo.findOne({ name: repo.name });

    if (!repoDetails) {
      repoDetails = new Repo({
        name: repo.name,
        repo_url: repo.html_url,
        commits,
      });
      await repoDetails.save();
    }

    return repoDetails;
  } catch (error) {
    console.error("Error finding or creating repo:", error);
    throw new Error("Error saving repo data");
  }
}

export { findOrCreateUser, getRepoDetails };
