import axios from "axios";
import { createContext, ReactNode, useContext} from "react";
import { DataStore } from "../store/DataStore";
interface Authtype {
  fetchAccessToken: (code: string) => Promise<void>;
}
const AuthContext = createContext<Authtype | undefined>(undefined); //creaContext(deafultValue)
//returns a context object. The context object itself does not hold any information.
// It represents which context other components read or provide
//AuthContext.Provider lets you provide the context value to components.
//AuthContext.Consumer is an alternative and rarely used way to read the context value.

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  //Here, it indicates that the component expects an object with a children property, and children must be of type ReactNode.
  const { setAccessToken } = DataStore(); 
  const fetchAccessToken = async (code: string) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/access_token?code=${code}`
      );
      const params = new URLSearchParams(res.data);
      const access_token = params.get("access_token");
      if (access_token) {
        localStorage.setItem("access_token", access_token);
        setAccessToken(access_token);
      }
    } catch (err) {
      console.error("Error fetching access token:", err);
    }
  };
  return (
    //pass the value to all the components to which we will warp AuthProvider
    <AuthContext.Provider value={{ fetchAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("!Error in context");
  return auth;
};
