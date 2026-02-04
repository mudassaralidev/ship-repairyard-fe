import { Stack } from "@mui/material";

const Section = ({ children }) => (
  <Stack
    spacing={2}
    sx={{
      p: 2,
      borderRadius: 2,
      bgcolor: "grey.50",
      border: "1px solid",
      borderColor: "divider",
    }}
  >
    {children}
  </Stack>
);

export default Section;
