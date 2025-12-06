import { createContext, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "./SnackbarContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface AuthData {
  isLoggedIn: boolean;
  isAdmin: boolean;
  token: string;
  username: string | null;
}

interface AuthContextType {
  authIsLoading: boolean;
  authData: AuthData | null;
  login: (
    data: { token: string; username: string },
    callback?: () => void,
  ) => void;
  logout: (callback?: () => void) => void;
  checkAdmin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const login = (
    data: { token: string; username: string },
    callback?: () => void,
  ) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    queryClient.invalidateQueries({ queryKey: ["authState"] });
    // While this will be overwritten when the refetch finishes, this will
    // allow users to see the logged-in state immediately.
    queryClient.setQueryData(["authState"], {
      isLoggedIn: true,
      isAdmin: false,
      token: data.token,
      username: data.username,
    });

    setTimeout(() => {
      if (callback) callback();
    }, 350);
  };

  const logout = (callback?: () => void) => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    queryClient.setQueryData(["authState"], {
      isLoggedIn: false,
      isAdmin: false,
      token: "",
      username: "",
    });
    if (callback) callback();
  };

  const fetchAuthState = async (): Promise<AuthData> => {
    const token = localStorage.getItem("token");
    if (!token) {
      return { isLoggedIn: false, isAdmin: false, token: "", username: "" };
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/auth/check-admin`,
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

  const {
    data: authData,
    isLoading: authIsLoading,
    error,
  } = useQuery({
    queryKey: ["authState"],
    queryFn: fetchAuthState,
    initialData: () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return { isLoggedIn: false, isAdmin: false, token: "", username: "" };
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (error && (error as any).response?.status === 401) {
    showSnackbar("You've been logged out, please sign in again.", "error");
    logout(() => navigate("/login"));
  }

  const checkAdmin = useCallback(async (): Promise<boolean> => {
    if (authData && authData.isLoggedIn) {
      return !!authData.isAdmin;
    }

    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/auth/check-admin`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data.isAdmin;
    }
    return false;
  }, [authData]);

  return (
    <AuthContext.Provider
      value={{
        authIsLoading,
        authData: authData ?? null,
        login,
        logout,
        checkAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
