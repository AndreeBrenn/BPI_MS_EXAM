import { create } from "zustand";
import axios from "axios";
import { AUTH_URL } from "../utils/urls";

export const useAuth = create((set) => ({
  user: null,
  isLoading: false,
  loginLoading: false,
  error: false,
  errorMessage: null,
  loginUser: async (username, password) => {
    set(() => ({ loginLoading: true }));
    try {
      const res = await axios.post(AUTH_URL + "login-user", {
        username,
        password,
      });

      set((state) => ({ user: (state.data = res.data) }));
    } catch (error) {
      console.log(error);
      set(() => ({ error: true, errorMessage: error }));
    } finally {
      set(() => ({ loginLoading: false }));
    }
  },
  refreshToken: async () => {
    set(() => ({ isLoading: true }));
    try {
      const res = await axios.get(AUTH_URL + "refresh");

      set((state) => ({ user: (state.data = res.data) }));
    } catch (error) {
      set(() => ({ error: true, errorMessage: error, user: null }));
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
  logoutUser: async () => {
    await axios.get(AUTH_URL + "logout-user");
    localStorage.removeItem("route");
    set(() => ({
      user: null,
      error: false,
      errorMessage: null,
      loginLoading: false,
    }));
  },
}));

export const getUser = () => useAuth.getState().user;
