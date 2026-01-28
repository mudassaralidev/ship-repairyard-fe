import PropTypes from "prop-types";
import {Link} from "react-router-dom";

// material-ui used
import {ButtonBase} from "@mui/material";

// project import
import Logo from "./LogoMain";
import LogoIcon from "./LogoIcon";
import {APP_DEFAULT_PATH} from "config";
import useAuth from "hooks/useAuth";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({reverse, isIcon, sx, to}) => {
  const {isLoggedIn, user: {shipyard_name, shipyard_logo} = {}} = useAuth();

  return (
    <ButtonBase disableRipple {...(isLoggedIn && {component: Link, to: !to ? APP_DEFAULT_PATH : to, sx})}>
      {isIcon ? (
        <LogoIcon />
      ) : (
        <Logo
          reverse={reverse}
          shipyardName={shipyard_name}
          shipyardLogo={shipyard_logo || "https://picsum.photos/id/870/200/300?grayscale&blur=2"}
        />
      )}
    </ButtonBase>
  );
};

LogoSection.propTypes = {
  reverse: PropTypes.bool,
  isIcon: PropTypes.bool,
  sx: PropTypes.object,
  to: PropTypes.string
};

export default LogoSection;
