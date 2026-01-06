import { Edit } from "@mui/icons-material";
import {
  Paper,
  Grid,
  Avatar,
  Typography,
  Stack,
  Chip,
  Box,
  Button,
  useTheme,
} from "@mui/material";
import LevelProgressBar from "@/Components/charts/LevelProgressBar";
import { User } from "@/types/users";

export const ProfileHeader = ({
  user,
  handleUpdate,
}: {
  user: User;
  handleUpdate: () => void;
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 4,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: theme.palette.primary.main,
              fontSize: "2rem",
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
        </Grid>
        <Grid size="grow">
          <Typography variant="h4" fontWeight="bold">
            {user?.username}
          </Typography>
          <Stack direction="row" spacing={1} mt={1}>
            {user?.roles?.map((role: string) => (
              <Chip
                key={role}
                label={role}
                size="small"
                color={role === "admin" ? "secondary" : "default"}
                variant="outlined"
              />
            ))}
          </Stack>
          <Box sx={{ mt: 2, maxWidth: 400 }}>
            {user?.level && user?.xp !== undefined && (
              <LevelProgressBar level={user.level} xp={user.xp} />
            )}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: "auto" }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleUpdate}
            sx={{ borderRadius: 2 }}
          >
            Edit Profile
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
