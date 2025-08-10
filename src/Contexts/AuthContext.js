import { createContext, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "./SnackbarContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const fetchAuthState = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return { isLoggedIn: false, isAdmin: false, token: "", username: "" };
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/auth/check-admin`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status >= 401) {
        return { isLoggedIn: false, isAdmin: false, token: "", username: "" };
      }

      return {
        token,
        isLoggedIn: true,
        isAdmin: response.data.isAdmin,
        username: localStorage.getItem("username"),
      };
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      return { isLoggedIn: false, isAdmin: false, token: "", username: "" };
    }
  };

  const { data: authData, isLoading: authIsLoading } = useQuery({
    queryKey: ["authState"],
    queryFn: fetchAuthState,
    onError: (error) => {
      if (error.response?.status === 401) {
        showSnackbar("You've been logged out, please sign in again.", "error");
        logout(() => navigate("/login"));
      }
    },
    onSuccess: (data) => {
      console.dir(data);
    },
  });

  const login = (data, callback) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    queryClient.invalidateQueries("authState");
    if (callback) callback();
  };

  const logout = (callback) => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    queryClient.invalidateQueries("authState");
    if (callback) callback();
  };

  const checkAdmin = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/auth/check-admin`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data.isAdmin;
    }
    return false;
  }, []);

  return (
    <AuthContext.Provider
      value={{ authIsLoading, authData, login, logout, checkAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
