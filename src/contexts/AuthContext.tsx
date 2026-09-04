import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import { getMe, login as loginApi, logout as logoutApi } from "../api/auth";

import type { CurrentUser } from "../api/auth";

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<CurrentUser>;

  refreshUser: () => Promise<CurrentUser>;

  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const currentUser = await getMe();

    setUser(currentUser);

    return currentUser;
  }, []);

  const login = async (email: string, password: string) => {
    await loginApi(email, password);

    return await refreshUser();
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await refreshUser();
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [refreshUser]);

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
