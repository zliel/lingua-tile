import { Button } from "@mui/material";
import { useState } from "react";

const BuggyComponent = () => {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("This is a test error from BuggyComponent!");
  }

  return (
    <Button
      variant="contained"
      color="error"
      onClick={() => setShouldError(true)}
      sx={{ m: 2 }}
    >
      Trigger Error
    </Button>
  );
};

export default BuggyComponent;
