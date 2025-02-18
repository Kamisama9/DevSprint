import { findOrCreateUser, getRepoDetails } from "./dataController.js";
import {
  fetchUserCommits,
  fetchUserData,
  fetchUserRepo,
} from "../utils/githubApi.js";

const checkOutdated = (lastupdate) => {
  const now = Date.now();
  const diff = now - new Date(lastupdate);
  return diff > 24 * 60 * 60 * 1000; //true if less than 24 hours
};

const getUserData = async (req, res) => {
  try {
    const userRepos = await getData(req);
    res.json(userRepos);
  } catch (error) {
    res.error(500).json({ error: "Failed to fetch user data" });
  }
};

const getData = async (req) => {
  const authorization = req.get("Authorization");
  const userData = await fetchUserData(authorization);
  let user = await findOrCreateUser(userData);
  // till here required everytime
  //how to add repos to user part using ref and populate?
  console.log(user);

  const userRepoData = await fetchUserRepo(user.repos_url, authorization);
  const userRepos = await getReposCommit(userRepoData, authorization);
  return { user, userRepos };
};

const getReposCommit = async (userRepoData, authorization) => {
  const reposWithCommits = await Promise.all(
    userRepoData.map(async (repo) => {
      try {
        const commitsUrl = repo.commits_url.replace("{/sha}", "");
        const commit = await fetchUserCommits(commitsUrl, authorization);
        const repos = await getRepoDetails(repo, commit);

        return { repos };
      } catch (error) {
        console.error(`Error fetching commits for repo: ${repo.name}`, error);
        return null;
      }
    })
  );
  return reposWithCommits.filter((repo) => repo !== null);
};

export { getUserData };
