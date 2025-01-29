import {
  createContext,
  useContext,
  ReactNode,
  useState,
  Children,
} from "react";
import axios from "axios";
interface ContextType {
  fetchAccessToken :(code:string)=>Promise<void>
}

const AuthContext = createContext<ContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const fetchAccessToken = async (code: string) => {
    const response = await axios.get(
      `http://localhost:8000/api/v1/access_token?code=${code}`
    );
    const params = new URLSearchParams(response.data);
    const access_token = params.get("access_token");

    if (access_token) {
      localStorage.setItem("access_token", access_token); //do it in Zustand
    }
  };

  return(
    <AuthContext.Provider value={{fetchAccessToken}}>
        {children}
    </AuthContext.Provider>
)
};

export const useAuth=()=>{
    const context=useContext(AuthContext);
    return context;
}

