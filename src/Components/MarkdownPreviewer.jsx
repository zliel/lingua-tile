import { MuiMarkdown } from "mui-markdown";
import { Box, TextField, Grid } from "@mui/material";

const MarkdownPreviewer = ({ value, onChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
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
      </Grid>
      <Grid item xs={6}>
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            padding: 2,
            height: "100%",
            maxHeight: 492,
            overflowY: "auto",
          }}
        >
          <MuiMarkdown>{value}</MuiMarkdown>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MarkdownPreviewer;
