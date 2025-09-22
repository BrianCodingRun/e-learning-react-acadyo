import type { User } from "@/types/User";
import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Auth = {
  token: string;
  setToken: (token: string) => void;
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<Auth>()(
  persist(
    (set) => ({
      token: Cookies.get("token") || "", // lecture du token depuis le cookie
      setToken: (token) => {
        Cookies.set("token", token, { expires: 1, secure: true }); // sauvegarde en cookie (7 jours)
        set({ token });
      },
      user: {
        id: "",
        name: "",
        email: "",
        roles: [],
      },
      setUser: (user) => set({ user }),
      logout: () => {
        Cookies.remove("token"); // suppression du cookie
        set({
          token: "",
          user: {
            id: "",
            name: "",
            email: "",
            roles: [],
          },
        });
      },
    }),
    {
      name: "auth-user", // ⚠️ ce nom concerne uniquement le user
      partialize: (state) => ({ user: state.user }),
      // on dit à persist de ne stocker que "user" (le token est déjà dans le cookie)
    }
  )
);
