import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, MentorProfile } from "../types";
import { authAPI } from "../services/api";

interface AuthState {
  user: User | null;
  mentorProfile: MentorProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (adminId: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  updateProfile: (profile: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      mentorProfile: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const data = await authAPI.login(email, password);
          localStorage.setItem("token", data.token);
          set({
            user: data.user,
            mentorProfile: data.mentorProfile ?? null,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      adminLogin: async (adminId, password) => {
        set({ isLoading: true });
        try {
          const data = await authAPI.adminLogin(adminId, password);
          localStorage.setItem("token", data.token);
          set({
            user: data.user,
            mentorProfile: data.mentorProfile ?? null,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const data = await authAPI.register(userData);
          localStorage.setItem("token", data.token);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        set({
          user: null,
          mentorProfile: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }
        try {
          const data = await authAPI.getMe();
          set({
            user: data.user,
            mentorProfile: data.mentorProfile ?? null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          localStorage.removeItem("token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      updateUser: (userData) => {
        const current = get().user;
        if (current) set({ user: { ...current, ...userData } });
      },

      updateProfile: async (profile) => {
        const current = get().user;
        if (!current) {
          throw new Error("Not authenticated");
        }

        const data = await authAPI.updateMe(profile);
        set({
          user: data.user,
          mentorProfile: data.mentorProfile ?? null,
        });
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
