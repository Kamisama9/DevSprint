import { useEffect, useState } from "react"
import axios from "axios";
interface UserData{
    login:string,
    name:string
}
interface Repo{
    name:string
}

const Home=()=>{
    const [rerender,setRerender]=useState<true|false>(false);
    const [userData,setUserData]=useState<UserData | null> (null)
    const [userRepos,setUserRepos]=useState<Repo[]>([]);
    useEffect(()=>{
        const searchURL=window.location.search; 
        const queryParams=new URLSearchParams(searchURL)
        const codeParam=queryParams.get("code");

        if(codeParam && (localStorage.getItem("access_token")===null)){
            const getAccessToken=async()=>{
                const response=await axios.get("http://localhost:8000/api/v1/access_token?code="+codeParam);
                const data =response.data;
                const params=new URLSearchParams(data);
                const access_token=params.get("access_token");
                console.log(access_token);
                if(access_token){
                    localStorage.setItem('access_token',access_token); //doesnot rerender on storing in local storage
                    setRerender(!rerender);
                }
            }
            getAccessToken();
            console.log('Success in Authoriztion')
        }
        else{
            console.log("Error in Authorization")
        }
        
    },[]);

    const getUserData=async()=>{
        const response=await axios.get("http://localhost:8000/api/v1/user_data",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("access_token") //format-->Bearer ACCESSTOKEN
            }
        })
        const data =response.data;
        console.log(data);
        setUserData(data);
        if(data.repos_url)
        getRepos(data?.repos_url)
    }
    const getRepos=async(URL:string)=>{
        const res=await axios.get(URL);
        const data= res.data;
        setUserRepos(data);
        console.log(userRepos)
    }
    return(
        <div>
            {localStorage.getItem("access_token")?
            <>
            <h1>Hi User</h1>
            <button onClick={()=>{
                localStorage.removeItem("access_token"); 
                setRerender(!rerender);
                }}>
                Log Out
            </button>
            <h3>Get User Data</h3>
            <button onClick={getUserData}>Get Data</button>
            {userData?
                <>
                <h4>{userData?.login}</h4>
                <h4>{userData?.name}</h4>
                <div>{userRepos?<>
                {userRepos.map((repo)=>{
                    return (
                        <h4>{repo?.name}</h4>
                    )
                })}
                </>:<></>}</div>
                
                </>:<></>
            }
            </>
            :
            <>
            <h3>user is not logged in</h3>
            <a href="/login">login</a>
            </>}
        </div>
    )
}
export default Home;