import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../utils/api";

const AuthContext = createContext();
const AUTH_STORAGE_KEY = "geopulse_auth";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistAuth = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: nextToken, user: nextUser }),
    );
  };

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("geopulse_user");
    localStorage.removeItem("geopulse_users");
  };

  // Restore session from local storage and validate token.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

        if (!savedAuth) {
          return;
        }

        const parsedAuth = JSON.parse(savedAuth);
        if (!parsedAuth?.token) {
          clearAuth();
          return;
        }

        const response = await apiRequest("/api/auth/me", {
          token: parsedAuth.token,
        });

        persistAuth(parsedAuth.token, response.user);
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      persistAuth(response.token, response.user);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        body: userData,
      });

      persistAuth(response.token, response.user);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    clearAuth();
  };

  // Update user profile
  const updateUser = (updatedData) => {
    if (!user || !token) {
      return;
    }

    const updatedUser = { ...user, ...updatedData };
    persistAuth(token, updatedUser);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: Boolean(user && token),
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
