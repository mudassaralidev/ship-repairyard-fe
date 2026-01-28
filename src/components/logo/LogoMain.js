import PropTypes from "prop-types";
import {Box, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";

const LogoMain = ({shipyardName, shipyardLogo}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center"
      }}
    >
      <Box
        component="img"
        src={shipyardLogo}
        alt="Shipyard"
        sx={{
          width: 30,
          height: 30,
          objectFit: "contain"
        }}
      />

      <Typography
        variant="h6"
        sx={{
          maxWidth: "170px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontWeight: "bold",
          color: theme.palette.text.primary
        }}
        title={shipyardName} // shows full name on hover
      >
        {shipyardName}
      </Typography>
    </Box>
  );
};

LogoMain.propTypes = {
  shipyardName: PropTypes.string
};

export default LogoMain;
