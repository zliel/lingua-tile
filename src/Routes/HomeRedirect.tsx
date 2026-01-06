import { Navigate } from "react-router";
import { useAuth } from "@/Contexts/AuthContext";
import Home from "./Home";
export const HomeRedirect = () => {
  const { authData, authIsLoading } = useAuth();
  if (authIsLoading) {
    return null;
  }

  if (authData?.isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Home />;
};
