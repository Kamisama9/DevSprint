import { useEffect, useState } from "react";
import axios from "axios";

interface UserData {
    login: string;
    name: string;
    repos_url?: string;
}

interface Repo {
    name: string;
}

const Home = () => {
    const [rerender, setRerender] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [userRepos, setUserRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccessToken = async () => {
            const searchURL = window.location.search;
            const queryParams = new URLSearchParams(searchURL);
            const codeParam = queryParams.get("code");

            if (codeParam && !localStorage.getItem("access_token")) {
                try {
                    setLoading(true);
                    const response = await axios.get(`http://localhost:8000/api/v1/access_token?code=${codeParam}`);
                    const params = new URLSearchParams(response.data);
                    const access_token = params.get("access_token");

                    if (access_token) {
                        localStorage.setItem("access_token", access_token);
                        setRerender(prev => !prev);
                    }
                } catch (err) {
                    setError("Failed to fetch access token.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchAccessToken();
    }, [rerender]);

    const getUserData = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8000/api/v1/user_data", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            const data = response.data;
            setUserData(data);
            if (data.repos_url) {
                getRepos(data.repos_url);
            }
        } catch (err) {
            setError("Failed to fetch user data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getRepos = async (url: string) => {
        try {
            setLoading(true);
            const response = await axios.get(url);
            setUserRepos(response.data);
        } catch (err) {
            setError("Failed to fetch repositories.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setRerender(prev => !prev);
        setUserData(null);
        setUserRepos([]);
    };

    return (
        <div>
            {localStorage.getItem("access_token") ? (
                <>
                    <h1>Hi User</h1>
                    <button onClick={handleLogout}>Log Out</button>
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
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Home;