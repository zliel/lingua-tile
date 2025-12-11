import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useQuery } from "@tanstack/react-query";

const ProtectedRoute = ({
  isAdminPage = false,
  children,
}: {
  isAdminPage?: boolean;
  children: React.ReactNode;
}) => {
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
    if (!isLoading && !authIsLoading) {
      if (isAdminPage && (isError || !isAdmin)) {
        showSnackbar("You do not have permission to view that page", "error");

        return navigate("/");
      }

      // Otherwise it's just a page for logged-in users
      if (isError || !authData?.isLoggedIn) {
        console.log("Redirecting to login page from ProtectedRoute");
        showSnackbar("You must be logged in to view that page", "error");
        return navigate("/login");
      }
    }
  }, [isError, isLoading, isAdmin, navigate, showSnackbar]);

  if (authIsLoading || isLoading) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
