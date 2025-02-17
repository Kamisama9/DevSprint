// import axios from "axios";
// import User from "../models/userSchema.js"
// import Repo from "../models/repoSchema.js"
// const getUserData = async (req, res) => {
//   try {
//     // Fetch user data
//     const userResponse = await axios.get("https://api.github.com/user", {
//       headers: {
//         Authorization: req.get("Authorization"), // Bearer ACCESS_TOKEN
//       },
//     });
//     const userData = userResponse.data;
//     const user=await User.findOne({username:userData.login});
//     if(!user){
//       user =new User({
//         username:userData.login,
//         name:userData.name||"",
//         repos:[],
//       })
//       aw}
//     // Fetch repositories of the user
//     const reposResponse = await axios.get(userData.repos_url, {
//       headers: {
//         Authorization: req.get("Authorization"),
//       },
//     });ait user.save();
//

//     const userRepos = reposResponse.data.map((repo) => ({
//       name: repo.name,
//       html_url: repo.html_url,
//       commits_url: repo.commits_url.replace("{/sha}", ""),
//     }));
//     // Fetch commits for each repository
//     const commitsPromises = userRepos.map(async (repo) => {
//       try {
//         const commitsResponse = await axios.get(repo.commits_url, {
//           headers: {
//             Authorization: req.get("Authorization"),
//           },
//         });

//         const commits = commitsResponse.data.map((commit) => ({
//           message: commit.commit.message,
//           date: commit.commit.committer.date,
//         }));
//         const repoDetails=await Repo.findOne({name:repo.name});
//         if(!repoDetails){
//           const repoDetails=new Repo({
//             name:repo.name,
//             repo_url:repo.html_url,
//             commits,
//           })
//           await repoDetails.save();
//         }

//         return { ...repo, commits }; // Add commits to the repo object
//       } catch (error) {
//         console.error(`Error fetching commits for repo: ${repo.name}`, error);
//         return { ...repo, commits: [] }; // Return empty commits in case of error
//       }
//     });

//     // Wait for all commit promises to resolve
//     const reposWithCommits = await Promise.all(commitsPromises);
//     console.log(reposWithCommits)
//     // Send user data along with repositories and their commits to frontend
//     res.json({ userData, userRepos: reposWithCommits });
//   } catch (error) {
//     console.error("Error fetching user data or repositories:", error);
//     res.status(500).json({ error: "Failed to fetch user data or repositories" });
//   }
// };

// export default getUserData;

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
    const userRepos =await getData(req);
    console.log(userRepos)
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
  console.log(user.repos)
  if(user.repos==[]){
  const userRepoData = await fetchUserRepo(user.repos_url, authorization);
  const userRepos = await getReposCommit(userRepoData, authorization);
  return {userData,userRepos} ;
  }else{

  }
 
};

const getReposCommit = async (userRepoData, authorization) => {
  const reposWithCommits = await Promise.all(
    userRepoData.map(async (repo) => {
      try {
        const commitsUrl = repo.commits_url.replace('{/sha}', '');
        const commit = await fetchUserCommits(commitsUrl, authorization);
        const repos=await getRepoDetails(repo, commit);

        return { repos };
      } catch (error) {
        console.error(`Error fetching commits for repo: ${repo.name}`, error);
        return { ...repo, commits: [] };
      }
    })
  );
  return reposWithCommits.filter(repo=>repo!==null)
};

export { getUserData };
