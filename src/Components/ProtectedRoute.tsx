import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { Box, Skeleton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authData, checkAdmin } = useAuth();
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
      if (token) {
        return await checkAdmin();
      }
      return false;
    },
    enabled: !!token,
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
