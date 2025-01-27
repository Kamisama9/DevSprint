// import { useEffect ,useState } from "react";

import { useEffect, useState } from "react"
import axios from "axios";
interface UserData{
    login:string,
    name:string
}

// const Home = () => {
//     const [render,setRender]=useState(false)
//     useEffect(()=>{
//     const query = window.location.search;
//     const urlParams = new URLSearchParams(query);
//     const codeParam = urlParams.get("code");
//     console.log(codeParam);
  
//     if (codeParam && (localStorage.getItem("access_token")===null)) { //get Access_Token from backend
//         const getAccessToken=async()=>{
//             await fetch("http://localhost:8000/api/v1/access_token?code="+codeParam ,{
//                 method:"GET"
//             }).then((response)=>{
//                 return response.json();
//             }).then((data)=>{
//                 const AccessParams=new URLSearchParams(data);
//                 const access_token=AccessParams.get("access_token")
//                 if(access_token){
//                     localStorage.setItem("access_token",access_token); 
//                     setRender(!render)
//                 }
//             })
//         }
//         getAccessToken();
//         console.log("Authorization Code:", codeParam);
//     } else {
//       console.log("No authorization code found.");
//     }
//     },[])
//   return (
//     <div>Home</div>
//   )
// }

// export default Home

const Home=()=>{
    const [rerender,setRerender]=useState<true|false>(false);
    const [userData,setUserData]=useState<UserData | null> (null)
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
                "Authorization":"Bearer "+localStorage.getItem("access_token") //Bearer ACCESSTOKEN
            }
        })
        const data =response.data;
        console.log(data);
        setUserData(data)
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
                </>:<></>
            }
            </>
            :
            <>
            <h3>user is not logged in</h3>
            <a href="/login"></a>
            </>}
        </div>
    )
}
export default Home;