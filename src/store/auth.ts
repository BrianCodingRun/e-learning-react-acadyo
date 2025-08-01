import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Auth = {
  token: string;
  setToken: (token: string) => void;
};

export const useAuthStore = create<Auth>()(
  persist(
    (set) => ({
      token: "",
      setToken: (token) => set({ token }),
    }),
    {
      name: "auth-user",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
