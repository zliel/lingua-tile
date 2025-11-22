import { useAuth } from "../Contexts/AuthContext";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import NewSectionForm from "../Components/NewSectionForm";
import { useQuery } from "@tanstack/react-query";
import { SectionTable } from "@/Components/admin/SectionTable";
import { TableSkeleton } from "@/Components/skeletons/TableSkeleton";
import FormSkeleton from "@/Components/skeletons/FormSkeleton";

const AdminSectionTable = () => {
  const { authData, authIsLoading } = useAuth();

  const {
    data: lessons = [],
    isLoading: isLoadingLessons,
    isError: isErrorLessons,
  } = useQuery({
    queryKey: ["lessons", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/lessons/all`,
      );

      return response.data;
    },
    enabled: !!authData,
  });

  const {
    data: sections = [],
    isLoading: isLoadingSections,
    isError: isErrorSections,
  } = useQuery({
    queryKey: ["sections", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/sections/all`,
      );

      return response.data;
    },
    enabled: !!authData,
  });

  if (isLoadingLessons || isLoadingSections || authIsLoading) {
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
        <FormSkeleton title={true} fields={2} buttons={1} width={400} />
        <TableSkeleton rows={5} columns={3} />
      </Box>
    );
  }

  if (isErrorLessons || isErrorSections) {
    return (
      <Typography variant="h6" textAlign="center">
        Failed to fetch data
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
        Sections Table
      </Typography>
      <NewSectionForm lessons={lessons} />
      <SectionTable sections={sections} lessons={lessons} />
    </Box>
  );
};

export default AdminSectionTable;
