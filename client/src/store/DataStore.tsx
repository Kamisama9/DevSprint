import { create } from "zustand";
import axios from "axios";

interface UserData {
  username: string;
  name: string;
  repos_url?: string;
}

interface Repo {
  repos: object[];
}

interface StoreType {
  accessToken: string | null;
  userData: UserData | null;
  userRepos: Repo[];
  loading: boolean;
  error: string | null;
  setAccessToken: (token: string | null) => void;
  getUserData: () => Promise<void>;
  logout: () => void;
}

export const DataStore = create<StoreType>((set, get) => ({
  accessToken: localStorage.getItem("access_token") || null,
  userData: null,
  userRepos: [],
  loading: false,
  error: null,

  setAccessToken: (token) => {
    set({ accessToken: token });
  },

  getUserData: async () => {
    const { accessToken } = get();
    if (!accessToken) return;

    try {
      set({ loading: true, error: null });
      const res = await axios.get(`http://localhost:8000/api/v1/user_data`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = res.data;
      const {user,userRepos:repos}=data
      console.log(repos)
      set({ userData: user ,userRepos:repos});
    } catch (error) {
      set({ error: "Failed to fetch user data" });
      console.error("Error fetching user data:", error);
    } finally {
      set({ loading: false });
    }
  },
  logout: () => {
    localStorage.removeItem("access_token");
    set(() => ({ accessToken: null, userData: null, userRepos: [] }));
  },
}));
