import { useAuth } from "@/Contexts/AuthContext";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import { User } from "@/types/users";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridActionsCellItem,
  GridDeleteIcon,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const UserTable = ({ users }: { users: User[] }) => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (user: User) => {
      await axios.put(
        `${import.meta.env.VITE_APP_API_BASE}/api/users/update/${user._id}`,
        user,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
    },
    onSuccess: () => {
      showSnackbar("User updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["users", authData?.token] });
    },
    onError: () => {
      showSnackbar("Failed to update user", "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_BASE}/api/users/delete/${userId}`,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
    },
    onSuccess: () => {
      showSnackbar("User deleted successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["users", authData?.token] });
    },
    onError: () => {
      showSnackbar("Failed to delete user", "error");
    },
  });

  const handleProcessRowUpdate = async (newRow: User, oldRow: User) => {
    if (JSON.stringify(newRow) === JSON.stringify(oldRow)) return oldRow;

    await updateMutation.mutateAsync(newRow);
    return newRow;
  };

  const handleDelete = (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    deleteMutation.mutateAsync(userId);
  };

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "username",
      headerName: "Username",
      width: 180,
      editable: true,
    },
    {
      field: "completedLessons",
      headerName: "Completed Lessons",
      minWidth: 200,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <span>{params.value?.join(", ")}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<GridDeleteIcon color="error" />}
          label="Delete"
          onClick={() => handleDelete(params.id as string)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 600, width: "80%", mx: "auto", mt: 2 }}>
      <DataGrid
        label="Users"
        rows={users}
        columns={columns}
        loading={updateMutation.isPending || deleteMutation.isPending}
        getRowId={(row) => row._id}
        showToolbar
        processRowUpdate={handleProcessRowUpdate}
      />
    </Box>
  );
};
