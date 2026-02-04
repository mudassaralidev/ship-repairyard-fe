import {
  Button,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TableContainer,
  Stack,
  Typography,
  Paper,
} from "@mui/material";

const InvalidRowsTable = ({ rows, onDownload }) => (
  <Stack spacing={2}>
    {/* Header */}
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="subtitle1" fontWeight={600}>
        Invalid Rows
      </Typography>

      <Button variant="outlined" onClick={onDownload}>
        Download Invalid Rows
      </Button>
    </Stack>

    {/* Scrollable Table */}
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: 200, // 👈 fixed height
        overflow: "auto",
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Row</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Errors</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.rowNumber}>
              <TableCell>{r.rowNumber}</TableCell>
              <TableCell>{r.errors.join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Stack>
);

export default InvalidRowsTable;
