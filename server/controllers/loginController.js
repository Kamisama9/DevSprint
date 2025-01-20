import axios from "axios";
import { configDotenv } from "dotenv";
configDotenv()

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const loginController = async (req, res) => {
  const params =
    "?client_id=" +
    client_id +
    "&client_secret=" +
    client_secret +
    "&code=" +
    req.query.code;
    console.log(params)
  const response=await axios
    .post("https://github.com/login/oauth/access_token" + params, {
      headers: {
        Accept: "application/json", //to ensure github responds with json
      },
    })
    console.log(response)
    const access_token=response.data 
    console.log(access_token)
};

export default loginController;
