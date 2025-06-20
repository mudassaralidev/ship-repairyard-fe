import { Grid, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

const InfoMessage = ({ condition, name, entity, linkTo, linkText }) => {
  if (!condition) return null;

  return (
    <Grid item xs={12}>
      <Typography variant="body1" sx={{ marginTop: '12px' }}>
        There are no active {entity} for selected {entity === 'dockings' ? 'ship' : 'docking'} (<strong>{name}</strong>). Please visit{' '}
        <MuiLink component={Link} to={linkTo} underline="hover">
          {linkText}
        </MuiLink>{' '}
        to create {entity} or select one with existing {entity} from the dropdown.
      </Typography>
    </Grid>
  );
};

export default InfoMessage;
