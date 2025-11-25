import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useQuery } from "@tanstack/react-query";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authData, authIsLoading, checkAdmin } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const token = authData?.token || localStorage.getItem("token");
  const {
    data: isAdmin,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["checkAdmin", token],
    queryFn: async () => {
      if (!authIsLoading && authData && typeof authData.isAdmin === "boolean") {
        return authData.isAdmin;
      }

      if (token) {
        return await checkAdmin();
      }

      return false;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isLoading) {
      if (isError || !isAdmin) {
        showSnackbar("You are not authorized to view that page", "error");
        navigate("/home");
      }
    }
  }, [isError, isLoading, isAdmin, navigate, showSnackbar]);

  if (isError || !isAdmin) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
