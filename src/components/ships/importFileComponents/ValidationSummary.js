import { Typography, Stack } from "@mui/material";

const ValidationSummary = ({ valid, invalid }) => (
  <Stack direction="row" spacing={2}>
    <Typography color="success.main">✔ {valid} valid rows</Typography>
    <Typography color="error.main">✖ {invalid} invalid rows</Typography>
  </Stack>
);

export default ValidationSummary;
