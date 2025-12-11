import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import LanguageIcon from "@mui/icons-material/Language";
import GitHub from "@mui/icons-material/GitHub";
import Palette from "@mui/icons-material/Palette";
import RocketLaunch from "@mui/icons-material/RocketLaunch";
import QuestionAnswer from "@mui/icons-material/QuestionAnswer";

function About() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ width: "100%", overflowX: "hidden", pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          py: 8,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
            mb={2}
          >
            <LanguageIcon sx={{ fontSize: 60 }} />
            <Typography
              variant="h1"
              sx={{
                fontWeight: "bold",
                fontSize: isMobile ? "2.5rem" : "3.5rem",
              }}
            >
              LinguaTile
            </Typography>
          </Box>
          <Typography
            variant="h6"
            component="p"
            sx={{
              opacity: 0.9,
              maxWidth: "800px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            A passion project making Japanese learning accessible, engaging, and
            effective. Combining proven techniques with modern technology to
            build confidence and fluency.
          </Typography>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {/* Why? */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: "100%", boxShadow: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <QuestionAnswer color="primary" fontSize="large" />
                  <Typography variant="h4" component="h2" color="primary.main">
                    Why?
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  component="p"
                  sx={{ fontSize: "1.1rem" }}
                >
                  As I've spent more and more time learning, I've used many
                  different tools. Inspired by my own journey learning Japanese,
                  I'm building LinguaTile to bring together the best features
                  from the tools I’ve used, with a focus on simplicity and fun.
                  It’s also a project for me to learn more about full-stack
                  development and share my love for education.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* What's Next? */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: "100%", boxShadow: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <RocketLaunch color="secondary" fontSize="large" />
                  <Typography
                    variant="h4"
                    component="h2"
                    color="secondary.main"
                  >
                    What’s Next?
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                  Upcoming features include:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Guided Curriculum"
                      secondary="A structured path for Japanese grammar and vocabulary."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Rich Media Flashcards"
                      secondary="Flaschards with images, audio, and example sentences."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Dashboard"
                      secondary="Track your progress and stay motivated!"
                    />
                  </ListItem>
                </List>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  The platform will grow as I learn more and gather feedback!
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Tech Stack */}
          <Grid size={{ xs: 12 }}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={1} mb={4}>
                  <CodeIcon color="primary" fontSize="large" />
                  <Typography variant="h4" component="h2" color="primary.main">
                    Tech Stack
                  </Typography>
                </Box>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      color="text.primary"
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        pb: 1,
                        mb: 2,
                      }}
                    >
                      Front End
                    </Typography>
                    <List>
                      <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemText
                          primary="ReactJS"
                          secondary="Modern UI library for building interfaces"
                          sx={{ fontWeight: "bold" }}
                        />
                      </ListItem>
                      <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemText
                          primary="React-Router"
                          secondary="Simple navigation and routing"
                          sx={{ fontWeight: "bold" }}
                        />
                      </ListItem>
                      <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemText
                          primary="React-Query"
                          secondary="Efficient data fetching"
                          sx={{ fontWeight: "bold" }}
                        />
                      </ListItem>
                      <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemText
                          primary="Material-UI"
                          secondary="Beautiful, accessible components"
                          sx={{ fontWeight: "bold" }}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      color="text.primary"
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        pb: 1,
                        mb: 2,
                      }}
                    >
                      Back End
                    </Typography>
                    <List>
                      <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemText
                          primary="FastAPI"
                          secondary="Simple, highly-performant Python API library"
                          sx={{ fontWeight: "bold" }}
                        />
                      </ListItem>
                      <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemText
                          primary="FSRS"
                          secondary="A modern, effective spaced-repetition algorithm"
                          sx={{ fontWeight: "bold" }}
                        />
                      </ListItem>
                      <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemText
                          primary="PyMongo & MongoDB"
                          secondary="Flexible, scalable database"
                          sx={{ fontWeight: "bold" }}
                        />
                      </ListItem>
                      <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemText
                          primary="Redis"
                          secondary="Fast caching for translations"
                          sx={{ fontWeight: "bold" }}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Color Scheme */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: "100%", boxShadow: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Palette color="secondary" fontSize="large" />
                  <Typography
                    variant="h4"
                    component="h2"
                    color="secondary.main"
                  >
                    Color Scheme
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                  Why green and purple? They are my favorite colors!
                  Material-UI’s theming system makes it easy to keep the look
                  consistent and vibrant across the entire application.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: "100%", boxShadow: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <GitHub color="primary" fontSize="large" />
                  <Typography variant="h4" component="h2" color="primary.main">
                    Contact & Feedback
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                  Got suggestions, questions, or want to collaborate?
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                  Reach out or open an issue on{" "}
                  <Link
                    target={"_blank"}
                    href="https://github.com/zliel/lingua-tile"
                    color="secondary"
                    sx={{
                      fontWeight: "bold",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    GitHub!
                  </Link>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default About;
