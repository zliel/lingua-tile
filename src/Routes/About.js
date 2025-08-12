import {
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Box,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CodeIcon from "@mui/icons-material/Code";
import LanguageIcon from "@mui/icons-material/Language";
import { GitHub } from "@mui/icons-material";

function About() {
  const theme = useTheme();
  const primaryHeaderColor =
    theme.palette.mode === "light"
      ? theme.palette.primary.main
      : theme.palette.primary.dark;
  const secondaryHeaderColor =
    theme.palette.mode === "light"
      ? theme.palette.secondary.main
      : theme.palette.secondary.dark;

  return (
    <Container maxWidth="md" sx={{ p: 4 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Box display="flex" alignItems="center" gap={2}>
              <LanguageIcon fontSize="large" color="primary" />
              <Typography variant="h3" color={primaryHeaderColor}>
                LinguaTile
              </Typography>
            </Box>
          </Grid>

          <Divider />

          <Grid item>
            <Typography variant="h5" color={secondaryHeaderColor} gutterBottom>
              Mission Statement
            </Typography>
            <Typography variant="body1">
              LinguaTile is a passion project designed to make Japanese learning
              accessible, engaging, and effective. By combining proven language
              learning techniques with modern web technology, my goal is to help
              learners build confidence and fluency step by step.
            </Typography>
          </Grid>

          <Divider />

          <Grid item>
            <Typography variant="h5" color={primaryHeaderColor} gutterBottom>
              Why?
            </Typography>
            <Typography variant="body1">
              As I've spent more and more time learning, I've used many
              different tools. Inspired by my own journey learning Japanese, I'm
              building LinguaTile to bring together the best features from those
              tools I’ve used, with a focus on simplicity and fun. It’s also a
              project for me to learn more about full-stack development and
              share my love for education.
            </Typography>
          </Grid>

          <Divider />

          <Grid item>
            <Typography variant="h5" color={secondaryHeaderColor} gutterBottom>
              Tech Stack
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" color={primaryHeaderColor}>
                  <CodeIcon
                    sx={{ mr: 0.5, mb: 0.25, verticalAlign: "middle" }}
                  />{" "}
                  Front End
                </Typography>
                <List disablePadding>
                  <ListItem sx={{ pl: 0, pt: 0 }}>
                    <ListItemText
                      primary="ReactJS"
                      secondary="Modern UI library for building interfaces"
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText
                      primary="React-Router"
                      secondary="Simple navigation and routing"
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText
                      primary="React-Query"
                      secondary="Efficient data fetching"
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText
                      primary="Material-UI"
                      secondary="Beautiful, accessible components"
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" color={primaryHeaderColor}>
                  <CodeIcon
                    sx={{ mr: 0.5, mb: 0.25, verticalAlign: "middle" }}
                  />{" "}
                  Back End
                </Typography>
                <List disablePadding>
                  <ListItem sx={{ pl: 0, pt: 0 }}>
                    <ListItemText
                      primary="FastAPI"
                      secondary="Simple, highly-performant Python API library"
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText
                      primary="FSRS"
                      secondary="A modern, effective spaced-repetition algorithm"
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText
                      primary="PyMongo & MongoDB"
                      secondary="Flexible, scalable database"
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText
                      primary="Redis"
                      secondary="Fast caching for translations"
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Grid>

          <Divider />

          <Grid item>
            <Typography variant="h5" color={primaryHeaderColor} gutterBottom>
              Color Scheme (why green and purple?)
            </Typography>
            <Typography variant="body1">
              Green and purple are my favorite colors, and Material-UI’s theming
              system makes it easy to keep the look consistent and vibrant.
            </Typography>
          </Grid>

          <Divider />

          <Grid item>
            <Typography variant="h5" color={secondaryHeaderColor} gutterBottom>
              What’s Next?
            </Typography>
            <Typography variant="body1">
              Upcoming features include a spaced repetition system, vocabulary
              flashcards, and a guided sequence of Japanese grammar and
              vocabulary. The platform will grow as I learn more and gather
              feedback!
            </Typography>
          </Grid>

          <Divider />

          <Grid item>
            <Box display="flex" alignItems="center" gap={1}>
              <GitHub
                fontSize="large"
                sx={{ mr: 0, mb: 1, verticalAlign: "middle" }}
              />{" "}
              <Typography variant="h5" color={primaryHeaderColor} gutterBottom>
                Contact & Feedback
              </Typography>
            </Box>
            <Typography variant="body1">
              Got suggestions, questions, or want to collaborate? Reach out or
              open an issue on{" "}
              <Link
                target={"_blank"}
                href="https://github.com/zliel/lingua-tile"
                color="secondary"
              >
                GitHub!
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default About;
