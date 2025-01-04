import { useEffect } from "react";

const Login = () => {

  useEffect(() => {
    const query = window.location.search;
    const urlParams = new URLSearchParams(query);
    const codeParam = urlParams.get("code");
  
    if (codeParam) {
      console.log("Authorization Code:", codeParam);
    } else {
      console.log("No authorization code found.");
    }
  }, []);
  

  const handleLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${clientId}`
    );
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with GitHub</button>
    </div>
  );
};

export default Login;
