import { create } from "zustand";
import axios from "axios";

interface UserData {
  login: string;
  name: string;
  repos_url?: string;
}

interface Repo {
  name: string;
}

interface StoreType {
  accessToken: string | null;
  userData: UserData | null;
  userRepos: Repo[];
  loading: boolean;
  error: string | null;
  setAccessToken: (token: string | null) => void;
  getUserData: () => Promise<void>;
  getRepos: (url: string) => Promise<void>;
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

  getRepos: async (url: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(url);
      set({ userRepos: response.data });
    } catch (error) {
      set({ error: "Failed to fetch repositories" });
      console.error("Error fetching repos:", error);
    } finally {
      set({ loading: false });
    }
  },

  getUserData: async () => {
    const { accessToken, getRepos } = get();
    if (!accessToken) return;

    try {
      set({ loading: true, error: null });
      const res = await axios.get(`http://localhost:8000/api/v1/user_data`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = res.data;

      set({ userData: data });

      if (data.repos_url) {
        await getRepos(data.repos_url);
      }
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
