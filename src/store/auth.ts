import type { User } from "types/User";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
      token: "",
      setToken: (token) => set({ token }),
      user: {
        id: "",
        name: "",
        email: "",
        roles: [],
      },
      setUser: (user) => set({ user }),
      logout: () =>
        set({
          token: "",
          user: {
            id: "",
            name: "",
            email: "",
            roles: [],
          },
        }),
    }),
    {
      name: "auth-user",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
