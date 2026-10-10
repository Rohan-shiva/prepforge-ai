import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    try {
      const data = await login({ email, password });
      if (data && data.user) {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        setUser(data.user);
        return { success: true, user: data.user, message: data.message };
      }
      return { success: false, message: data?.message || "Invalid credentials." };
    } catch (err) {
      console.error("Login error:", err);
      localStorage.removeItem("token");
      setUser(null);
      const message = err.response?.data?.message || err.message || "Failed to login. Please try again.";
      return { success: false, message };
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    try {
      const data = await register({ username, email, password });
      if (data && data.user) {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        setUser(data.user);
        return { success: true, user: data.user, message: data.message };
      }
      return { success: false, message: data?.message || "Registration failed." };
    } catch (err) {
      console.error("Register error:", err);
      localStorage.removeItem("token");
      setUser(null);
      const message = err.response?.data?.message || err.message || "Failed to register. Please try again.";
      return { success: false, message };
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("auth");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("auth");
      setUser(null);
      setLoading(false);
    }
  };

  return { user, loading, handleLogin, handleRegister, handleLogout };
};