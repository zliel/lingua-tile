import { useEffect, useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { User } from "@/types/users";

const AdminUserTable = () => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<User>({
    _id: "",
    username: "",
    roles: [],
    completedLessons: [],
  });

  const queryClient = useQueryClient();

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (editingUserId) {
        if (event.key === "Escape") {
          setEditingUserId(null);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editingUserId]);

  const handleEdit = (user: User) => {
    setEditingUserId(user._id);
    setEditedUser(user);
  };

  const updateMutation = useMutation({
    mutationFn: async (userId: string) => {
      await axios.put(
        `${import.meta.env.VITE_APP_API_BASE}/api/users/update/${userId}`,
        editedUser,
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

  const handleUpdate = (userId: string) => {
    updateMutation.mutate(userId);
    setEditingUserId(null);
  };

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

  const handleDelete = async (userId: string) => {
    // In this situation I think that use the built-in window.confirm is a better option than the ConfirmationDialog component, as it
    // avoids overcomplicating the delete method.
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    deleteMutation.mutate(userId);
    setEditingUserId(null);
  };

  if (isLoading) {
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
        <Skeleton
          variant="rectangular"
          animation={"wave"}
          width="90%"
          height={40}
          sx={{ mb: 2 }}
        />
        <Skeleton
          variant="rectangular"
          animation={"wave"}
          width="90%"
          height={30}
          sx={{ mb: 2 }}
        />
        <Skeleton
          variant="rectangular"
          animation={"wave"}
          width="90%"
          height={20}
          sx={{ mb: 2 }}
        />
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
      <TableContainer
        sx={{ maxWidth: "80%", borderRadius: 2, border: `1px solid` }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Completed Lessons</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: User) => (
              <TableRow key={user._id} onDoubleClick={() => handleEdit(user)}>
                <TableCell>{user._id}</TableCell>
                <TableCell>
                  {editingUserId === user._id ? (
                    <TextField
                      value={editedUser.username}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          username: e.target.value,
                        })
                      }
                    />
                  ) : (
                    user.username
                  )}
                </TableCell>
                <TableCell>
                  {/* TODO: Set up the lesson reviews */}
                  {user.completedLessons}
                  {/* {editingUserId === user._id ? ( */}
                  {/*   <TextField */}
                  {/* value={editedUser.completedLessons} */}
                  {/* onChange={(e) => { */}
                  {/*   if (!editedUser) return; */}
                  {/**/}
                  {/*   setEditedUser({ */}
                  {/*     ...editedUser, */}
                  {/*     completedLessons: e.target.value, */}
                  {/*   }) */}
                  {/* }} */}
                  {/* /> */}
                  {/* ) : ( */}
                  {/* user.completedLessons */}
                  {/* )} */}
                </TableCell>
                <TableCell sx={{ whiteSpace: "noWrap" }}>
                  {editingUserId === user._id ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdate(user._id)}
                      >
                        Save
                      </Button>
                      <Button
                        sx={{ ml: 1 }}
                        variant="contained"
                        color="warning"
                        onClick={() => setEditingUserId(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(user)}
                    >
                      Update
                    </Button>
                  )}
                  <Button
                    sx={{ ml: 1 }}
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminUserTable;
