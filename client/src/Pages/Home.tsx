import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { DataStore } from "../store/DataStore";
import HeatMap from "./GithubHeatmap/HeatMap";

const Home = () => {
  const { fetchAccessToken } = useAuth();
  const { accessToken, userData, userRepos,getUserData, loading, error ,logout} = DataStore();
  console.log(userData);
  console.log(userRepos);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const codeParam = searchParams.get("code");

    if (codeParam && !accessToken) {
      fetchAccessToken(codeParam);
    }
  }, []);

  return (
    <div>
      {accessToken ? (
        <>
          <h1>Hi, User</h1>
          <button onClick={logout}>Logout</button>
          <button onClick={getUserData} disabled={loading}>
            {loading ? "Loading..." : "Get User Data"}
          </button>
          {userData && (
            <>
              <h4>Username: {userData.username}</h4>
              <h4>Name: {userData.name}</h4>
              <HeatMap/>
              <h3>User Repositories</h3>{
                userRepos.map((repo)=>{
                  return (<h3 key={repo.repos._id}>{repo.repos.name}</h3>)
                })
              }
              
            </>
          )}
        </>
      ) : (
        <>
          <h3>User is not logged in</h3>
          <a href="/login">Login</a>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Home;
