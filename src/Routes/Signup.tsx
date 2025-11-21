import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Analytics, LibraryBooks, School } from "@mui/icons-material";
import { SignupForm } from "@/Components/SignupForm";

function Signup() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        height: "90vh",
        py: 2,
        px: 8,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        sx={{
          width: "100%",
          height: "50%",
          mb: isMobile ? 4 : 0,
        }}
      >
        {/* Call to Action */}
        <Grid
          size={{ xs: 12, sm: 6 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            p: isMobile ? 2 : 6,
          }}
        >
          <Typography
            variant="h3"
            fontWeight={700}
            gutterBottom
            sx={{ fontSize: isMobile ? "2rem" : "2.5rem" }}
          >
            Take the First Step!
          </Typography>
          <Typography
            variant="h6"
            fontWeight={400}
            mb={3}
            sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
          >
            Start your Japanese language journey today. Sign up and unlock a
            world of learning!
          </Typography>
          <Typography
            variant="h6"
            fontWeight={500}
            mt={2}
            sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
          >
            Join today and get the following:
          </Typography>
          <List>
            <ListItem sx={{ pl: 0 }}>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <LibraryBooks />
              </ListItemIcon>
              <ListItemText
                primary={"Access to comprehensive Japanese learning resources"}
              />
            </ListItem>
            <ListItem sx={{ pl: 0 }}>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <School />
              </ListItemIcon>
              <ListItemText
                primary={"Personalized study plans tailored to your goals"}
              />
            </ListItem>
            <ListItem sx={{ pl: 0 }}>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <Analytics />
              </ListItemIcon>
              <ListItemText
                primary={"Progress tracking to monitor your improvement"}
              />
            </ListItem>
          </List>
        </Grid>

        {/* Signup Form Section */}
        <Grid
          size={{ xs: 12, sm: 6 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            p: isMobile ? 0 : 6,
            mb: isMobile ? 4 : 0,
          }}
        >
          <SignupForm />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Signup;
