import { useAuth } from "@/Contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography } from "@mui/material";
import { TableSkeleton } from "@/Components/skeletons/TableSkeleton";
import { UserTable } from "@/Components/admin/UserTable";
import { api } from "@/utils/apiClient";
import { User } from "@/types/users";

const AdminUserTable = () => {
  const { authData, authIsLoading } = useAuth();

  const token = authData?.token || localStorage.getItem("token");
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", token],
    queryFn: async () => {
      const response = await api.get<User[]>("/api/users/admin/all");
      return response.data;
    },
    enabled: !!token,
  });

  if (isLoading || authIsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Loading...
        </Typography>
        <TableSkeleton rows={5} columns={4} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography variant="h6" textAlign="center">
        Error loading users.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
        pb: 4,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Users Table
      </Typography>
      <UserTable users={users} />
    </Box>
  );
};

export default AdminUserTable;
