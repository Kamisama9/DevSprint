import axios from "axios";

// Fetch user data from GitHub API
const fetchUserData = async (authorization) => {
  try {
    const response = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: authorization,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data");
  }
};

// Fetch user repositories from GitHub API
const fetchUserRepo = async (repoUrl, authorization) => {
  try {
    const response = await axios.get(repoUrl, {
      headers: {
        Authorization: authorization,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user repos:", error);
    throw new Error("Failed to fetch repositories");
  }
};

// Fetch commits for a repository from GitHub API
const fetchUserCommits = async (commitUrl, authorization) => {
  try {
    const response = await axios.get(commitUrl, {
      headers: {
        Authorization: authorization,
      },
    });
    return response.data.map((commit) => ({
      message: commit.commit.message,
      date: commit.commit.committer.date,
    }));
  } catch (error) {
    console.error("Error fetching commits:", error);
    throw new Error("Failed to fetch commits");
  }
};

export { fetchUserData, fetchUserRepo, fetchUserCommits };
