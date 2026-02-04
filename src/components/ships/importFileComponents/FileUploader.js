import { Button, Typography, Stack } from "@mui/material";
import { UploadOutlined } from "@ant-design/icons";

const FileUploader = ({ disabled, onSelect, error }) => (
  <Stack spacing={1}>
    <Button
      variant="contained"
      component="label"
      disabled={disabled}
      startIcon={<UploadOutlined />}
    >
      Import File
      <input hidden type="file" accept=".csv,.xlsx" onChange={onSelect} />
    </Button>
    {error && <Typography color="error">{error}</Typography>}
  </Stack>
);

export default FileUploader;
