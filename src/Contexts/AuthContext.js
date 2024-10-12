import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "./SnackbarContext";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: "",
    isLoggedIn: false,
    isAdmin: false,
    username: "",
  });
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [authIsLoading, setAuthIsLoading] = useState(true);

  const checkAdmin = useCallback(async () => {
    try {
      const token = auth.token || localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/auth/check-admin`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return new Promise((resolve) => {
        setAuth((prevAuth) => {
          resolve(response.data.isAdmin);
          return {
            ...prevAuth,
            isAdmin: response.data.isAdmin,
          };
        });
      });
    } catch (error) {
      if (error.response.status === 401) {
        showSnackbar("You've been logged out, please sign in again.", "error");
        logout(() => navigate("/login"));
      }
      return Promise.resolve(false);
    } finally {
      setAuthIsLoading(false);
    }
  }, [auth.token, navigate, showSnackbar]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token) {
      checkAdmin().then((isAdmin) => {
        setAuth({
          token: token,
          isLoggedIn: true,
          isAdmin: isAdmin,
          username: username,
        });
      });
    } else {
      setAuthIsLoading(false);
    }
  }, [checkAdmin]);

  const login = (data, callback) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    setAuth({
      token: data.token,
      isLoggedIn: true,
      isAdmin: data.isAdmin,
      username: data.username,
    });
    if (callback) callback();
  };

  const logout = (callback) => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setAuth({ token: "", isLoggedIn: false, isAdmin: false, username: "" });
    if (callback) callback();
  };

  return (
    <AuthContext.Provider
      value={{ auth, authIsLoading, login, logout, checkAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
