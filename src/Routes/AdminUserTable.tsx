import { useAuth } from "../Contexts/AuthContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography } from "@mui/material";
import { UserTable } from "@/Components/admin/UserTable";
import { TableSkeleton } from "@/Components/skeletons/TableSkeleton";

const AdminUserTable = () => {
  const { authData, authIsLoading } = useAuth();

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/users/admin/all`,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
      return response.data;
    },
    enabled: !!authData,
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
