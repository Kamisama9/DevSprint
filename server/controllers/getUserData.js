import axios from "axios";
const getUserData=async (req,res)=>{
    req.get("Authorization"); //Bearer ACCESS_TOKEN 
    const response=await axios.get("https://api.github.com/user",{
        headers:{
            "Authorization":req.get("Authorization") //Bearer ACCESS_TOKEN 
        }
    })
    //const data=response.json(); // no need as axios automatically parser data to JSON (if applicable)
    const data =response.data;
    console.log(data)
    res.json(data) //send the data back to user
}
 
export default getUserData;