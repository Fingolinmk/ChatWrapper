// store/useStore.ts
"use client";
import { useEffect } from 'react';
import useAuthStore from './auth';

const useTokenExpiryCheck = () => {
  const { token, tokenExpiry, clearToken, clearUser } = useAuthStore();

  useEffect(() => {
    if (token && tokenExpiry) {
      const now = new Date().getTime();
      if (now >= tokenExpiry) {
        clearToken();
        clearUser();
      }
    }
  }, [token, tokenExpiry, clearToken, clearUser]);
};

export default useTokenExpiryCheck;