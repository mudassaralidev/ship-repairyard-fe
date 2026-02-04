import { Button, Stack } from "@mui/material";

const ImportActions = ({
  canValidate,
  canImport,
  loading,
  onValidate,
  onImport,
  onCancel,
}) => (
  <Stack direction="row" spacing={2} justifyContent="flex-end">
    <Button onClick={onCancel}>Cancel</Button>
    <Button disabled={!canValidate} onClick={onValidate}>
      Validate
    </Button>
    <Button
      variant="contained"
      disabled={!canImport || loading}
      onClick={onImport}
    >
      Import Ships
    </Button>
  </Stack>
);

export default ImportActions;
