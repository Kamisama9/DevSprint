import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { DataStore } from "../store/DataStore";


const Home = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const { fetchAccessToken } = useAuth();
  const { userData, getUserData ,userRepos} = DataStore();
  useEffect(() => {
    //will run onces the we will return back from login to home page with code
    const searchURL = window.location.search; //take URL from search bar
    const queryParams = new URLSearchParams(searchURL);
    const codeParam = queryParams.get("code");

    if (codeParam && !localStorage.getItem("access_token")) {
      setLoading(true);
      fetchAccessToken(codeParam);
      setLoading(false);
    }
  }, [fetchAccessToken]);


  return (
    <div>
      {localStorage.getItem("access_token") ? (
        <>
          <h1>Hi User</h1>
          {/* <button onClick={handleLogout}>Log Out</button> */}
          <h3>Get User Data</h3>
          <button onClick={getUserData} disabled={loading}>
            {loading ? "Loading..." : "Get Data"}
          </button>
          {userData && (
            <>
              <h4>{userData.login}</h4>
              <h4>{userData.name}</h4>
              <div>
                {userRepos.map((repo, index) => (
                  <h4 key={index}>{repo.name}</h4>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <h3>User is not logged in</h3>
          <a href="/login">Login</a>
        </>
      )}
      
    </div>
  );
};

export default Home;
