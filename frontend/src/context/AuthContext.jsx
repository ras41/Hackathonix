import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("geopulse_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // Simulate API call - In real app, this would be actual API
      const users = JSON.parse(localStorage.getItem("geopulse_users") || "[]");
      const user = users.find(
        (u) => u.email === email && u.password === password,
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
      localStorage.setItem(
        "geopulse_user",
        JSON.stringify(userWithoutPassword),
      );

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem("geopulse_users") || "[]");

      // Check if email already exists
      if (users.find((u) => u.email === userData.email)) {
        throw new Error("Email already registered");
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        polls: [],
      };

      // Save to "database" (localStorage)
      users.push(newUser);
      localStorage.setItem("geopulse_users", JSON.stringify(users));

      // Auto-login after registration
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem(
        "geopulse_user",
        JSON.stringify(userWithoutPassword),
      );

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("geopulse_user");
  };

  // Update user profile
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("geopulse_user", JSON.stringify(updatedUser));

    // Also update in users array
    const users = JSON.parse(localStorage.getItem("geopulse_users") || "[]");
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      localStorage.setItem("geopulse_users", JSON.stringify(users));
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
