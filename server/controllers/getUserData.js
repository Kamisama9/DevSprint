import axios from "axios";
import User from "../models/userSchema.js";
import Repo from "../models/repoSchema.js";

// Helper function to fetch user data from GitHub
const fetchUserData = async (authorization) => {
  const response = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: authorization, // Bearer ACCESS_TOKEN
    },
  });
  return response.data;
};

// Helper function to fetch repositories of the user from GitHub
const fetchUserRepos = async (reposUrl, authorization) => {
  const response = await axios.get(reposUrl, {
    headers: {
      Authorization: authorization,
    },
  });
  return response.data;
};

// Helper function to fetch commits of a repository
const fetchRepoCommits = async (commitsUrl, authorization) => {
  const response = await axios.get(commitsUrl, {
    headers: {
      Authorization: authorization,
    },
  });
  return response.data.map((commit) => ({
    message: commit.commit.message,
    date: commit.commit.committer.date,
  }));
};

// Helper function to check if the repository exists in the DB and create if not
const getRepoDetails = async (repo) => {
  let repoDetails = await Repo.findOne({ name: repo.name });
  if (!repoDetails) {
    repoDetails = new Repo({
      name: repo.name,
      repo_url: repo.html_url,
      commits: [],
    });
    await repoDetails.save();
  }
  return repoDetails;
};

// Main function to get user data, repos, and commits
const getUserData = async (req, res) => {
  try {
    const authorization = req.get("Authorization");

    // Fetch user data
    const userData = await fetchUserData(authorization);
    let user = await User.findOne({ username: userData.login });

    // If user doesn't exist, create a new one
    if (!user) {
      user = new User({
        username: userData.login,
        name: userData.name || "",
        repos: [],
      });
      await user.save();
    }

    // Fetch repositories
    const userReposData = await fetchUserRepos(userData.repos_url, authorization);
    const userRepos = userReposData.map((repo) => ({
      name: repo.name,
      html_url: repo.html_url,
      commits_url: repo.commits_url.replace("{/sha}", ""),
    }));

    // Fetch commits for each repository
    const commitsPromises = userRepos.map(async (repo) => {
      try {
        const commits = await fetchRepoCommits(repo.commits_url, authorization);

        // Check if the repository exists in DB, otherwise create it
        await getRepoDetails(repo);

        return { ...repo, commits }; // Add commits to the repo object
      } catch (error) {
        console.error(`Error fetching commits for repo: ${repo.name}`, error);
        return { ...repo, commits: [] }; // Return empty commits in case of error
      }
    });

    // Wait for all commit promises to resolve
    const reposWithCommits = await Promise.all(commitsPromises);
    console.log(reposWithCommits);

    // Send user data along with repositories and their commits to frontend
    res.json({ userData, userRepos: reposWithCommits });
  } catch (error) {
    console.error("Error fetching user data or repositories:", error);
    res.status(500).json({ error: "Failed to fetch user data or repositories" });
  }
};

export default getUserData;
