// store/auth.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthStore {
  token: string | null;
  user: string | null;
  tokenExpiry: number | null;
  setToken: (newToken: string, expiry: number) => void;
  clearToken: () => void;
  setUser: (newUser: string) => void;
  clearUser: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      tokenExpiry: null,
      setToken: (newToken: string, expiry: number) => {
        set({ token: newToken, tokenExpiry: expiry });
      },
      clearToken: () => {
        set({ token: null, tokenExpiry: null });
      },
      setUser: (newUser: string) => {
        set({ user: newUser });
      },
      clearUser: () => {
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user, tokenExpiry: state.tokenExpiry }),
    }
  )
);

export default useAuthStore;