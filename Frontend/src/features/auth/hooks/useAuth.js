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
    setLoading(true);
    try {
      const data = await login({ email, password });
      if (data && data.user) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login error:", err);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      if (data && data.user) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Register error:", err);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear auth-specific keys without wiping unrelated keys
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