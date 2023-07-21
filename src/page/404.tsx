import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

export default function NoMatch() {
  return (
    <Box
      sx={{
        margin: "auto",
        marginTop: "5rem",
      }}
    >
      <Typography variant="h2">*404*</Typography>
      <Typography color="error">
        <FormattedMessage
          id="noMatch.content"
          description="Description of the 404 page"
        />
      </Typography>
    </Box>
  );
}
