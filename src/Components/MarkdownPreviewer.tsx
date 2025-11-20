import { MuiMarkdown } from "mui-markdown";
import { Box, TextField, SxProps } from "@mui/material";

const MarkdownPreviewer = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sx?: SxProps;
}) => {
  return (
    <Box display="flex" gap={2}>
      <Box flex={1}>
        <TextField
          label="Content"
          value={value}
          onChange={onChange}
          multiline
          minRows={10}
          maxRows={20}
          variant="outlined"
          fullWidth
        />
      </Box>
      <Box
        flex={1}
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          padding: 2,
          maxHeight: 492,
          maxWidth: "50%",
          overflowY: "auto",
        }}
      >
        <MuiMarkdown>{value}</MuiMarkdown>
      </Box>
    </Box>
  );
};

export default MarkdownPreviewer;
