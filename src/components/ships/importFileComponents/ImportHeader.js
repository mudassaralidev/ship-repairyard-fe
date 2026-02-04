import { Typography, Stack } from "@mui/material";

const ImportHeader = ({ shipyardName }) => (
  <Stack spacing={0.5}>
    <Typography variant="h4">Bulk Ship Import</Typography>
    <Typography variant="body2" color="text.secondary">
      Ships will be created under shipyard: <b>{shipyardName}</b>
    </Typography>
  </Stack>
);

export default ImportHeader;
