import { Box, Skeleton, Typography } from "@mui/material";

interface FormSkeletonProps {
  fields?: number;
  buttons?: number;
  title?: boolean;
  width?: number;
}

const FormSkeleton = ({
  fields = 2,
  buttons = 1,
  title = true,
  width = 340,
}: FormSkeletonProps) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      mb: 2,
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 4,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
        width,
      }}
    >
      {title && (
        <Typography variant="h6" gutterBottom>
          <Skeleton width={width * 0.35} />
        </Typography>
      )}
      {Array.from({ length: fields }).map((_, i) => (
        <Skeleton
          key={`field-${i}`}
          variant="rectangular"
          width={width - 40}
          height={56}
          sx={{ mb: 2 }}
        />
      ))}
      {Array.from({ length: buttons }).map((_, i) => (
        <Skeleton
          key={`button-${i}`}
          variant="rectangular"
          width={width * 0.35}
          height={36}
          sx={{ mb: 2 }}
        />
      ))}
    </Box>
  </Box>
);

export default FormSkeleton;
