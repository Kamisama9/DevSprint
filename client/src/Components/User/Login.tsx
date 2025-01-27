
const Login = () => {
  //Forward user to github login screen(we pass the client ID to know which user) 
  // The user logs into GitHub and approves my OAUTH app's access to their data
  //they are forwarded to back to given location with a 'code' attribute
  //http://localhost:5173/?code=4634c79452b0b7726828
  //on backend use this code to request an access token from GitHub 
  //by making a POST request to GitHub's https://github.com/login/oauth/access_token
  //code can be only used once


  const handleLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    window.location.assign( //Navigates to the given URL.
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
