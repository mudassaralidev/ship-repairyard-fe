import { Box } from "@mui/material";

const ImportLayout = ({ header, footer, children }) => {
  return (
    <Box
      sx={{
        height: "calc(100vh - 96px)", // modal-safe height
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Sticky Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {header}
      </Box>

      {/* Scrollable Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 3,
        }}
      >
        {children}
      </Box>

      {/* Sticky Footer */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          backgroundColor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          padding: 2,
        }}
      >
        {footer}
      </Box>
    </Box>
  );
};

export default ImportLayout;
