import School from "@mui/icons-material/School";
import TrendingUp from "@mui/icons-material/TrendingUp";
import Translate from "@mui/icons-material/Translate";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  useTheme,
} from "@mui/material";

export const InfoSection = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h3"
        component="h2"
        align="center"
        gutterBottom
        sx={{ mb: 6, fontWeight: "bold", color: theme.palette.text.primary }}
      >
        Why Choose LinguaTile?
      </Typography>
      <Grid container spacing={4}>
        {[
          {
            icon: <School fontSize="large" color="primary" />,
            title: "Structured Lessons",
            description:
              "Follow a carefully curated curriculum that takes you from beginner to advanced levels step by step.",
          },
          {
            icon: <TrendingUp fontSize="large" color="primary" />,
            title: "Track Progress",
            description:
              "Monitor your learning journey with detailed statistics and visual progress indicators.",
          },
          {
            icon: <Translate fontSize="large" color="primary" />,
            title: "Interactive Practice",
            description:
              "Reinforce your knowledge with interactive exercises, flashcards, and real-world examples.",
          },
        ].map((feature, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: 2,
                boxShadow: 3,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
