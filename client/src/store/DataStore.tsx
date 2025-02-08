import { create } from "zustand";
import axios from "axios";
interface userData {
  login: string;
  name: string;
  repos_url?: string;
}
interface Repo {
  name: string;
}
interface StoreType {
  userData: userData | null;
  userRepos: Repo[] ;
  getUserData: () => Promise<void>;
  getRepos: (URL: string) => Promise<void>
}
export const DataStore = create<StoreType>((set,get) => ({
  userData: null,
  userRepos:[],
  getRepos:async(URL:string)=>{
    try {
        const response = await axios.get(URL);
        set(()=>({userRepos:response.data}))
    } catch (error) {
        
    }
  },
  getUserData: async () => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) return;
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/user_data`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const data = res.data;
      set(() => ({ userData: data }));
      if(data.repos_url){
       await get().getRepos(data.repos_url);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  
}));
