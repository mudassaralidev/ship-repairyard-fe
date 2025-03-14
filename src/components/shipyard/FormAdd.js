import { useEffect } from 'react';

// material-ui
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputLabel, Stack, TextField } from '@mui/material';

// third-party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import { openSnackbar } from 'api/snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { createShipyard, updateShipyard } from '../../redux/features/shipyard/actions';
import useAuth from 'hooks/useAuth';
import { clearSuccessMessage } from '../../redux/features/shipyard/slice';

// constant
const getInitialValues = (shipyard) => {
  const newShipyard = {
    name: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: ''
    }
  };

  return shipyard ? { ...newShipyard, ...shipyard } : newShipyard;
};

const FormAdd = ({ shipyard, closeModal }) => {
  const dispatch = useDispatch();
  const { successMessage, status } = useSelector((state) => state.shipyard);

  const { user } = useAuth();

  useEffect(() => {
    if (successMessage) {
      openSnackbar({
        open: true,
        message: successMessage,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });

      dispatch(clearSuccessMessage());
      closeModal();
    }

    if (status === 'failed') {
      closeModal();
      dispatch(clearSuccessMessage());
    }
  }, [successMessage, status]);

  const shipyardSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Name is required'),
    location: Yup.object().shape({
      address: Yup.string().max(500).required('Address is required'),
      city: Yup.string().max(255).required('City is required'),
      state: Yup.string().max(255).required('State is required'),
      country: Yup.string().max(255).required('Country is required'),
      postal_code: Yup.string().max(20).required('Postal code is required')
    })
  });

  const formik = useFormik({
    initialValues: getInitialValues(shipyard),
    validationSchema: shipyardSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (shipyard) {
          dispatch(updateShipyard(shipyard.id, values));
        } else {
          values.created_by = user.id;
          dispatch(createShipyard(values));
        }
        setSubmitting(false);
        // closeModal();
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <DialogTitle>{shipyard ? 'Edit Shipyard' : 'New Shipyard'}</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="name">Name</InputLabel>
                <TextField
                  fullWidth
                  id="name"
                  placeholder="Enter Shipyard Name"
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="address">Address</InputLabel>
                <TextField
                  fullWidth
                  id="address"
                  placeholder="Enter Address"
                  {...getFieldProps('location.address')}
                  error={Boolean(touched.location?.address && errors.location?.address)}
                  helperText={touched.location?.address && errors.location?.address}
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="city">City</InputLabel>
                <TextField
                  fullWidth
                  id="city"
                  placeholder="Enter City"
                  {...getFieldProps('location.city')}
                  error={Boolean(touched.location?.city && errors.location?.city)}
                  helperText={touched.location?.city && errors.location?.city}
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="state">State</InputLabel>
                <TextField
                  fullWidth
                  id="state"
                  placeholder="Enter State"
                  {...getFieldProps('location.state')}
                  error={Boolean(touched.location?.state && errors.location?.state)}
                  helperText={touched.location?.state && errors.location?.state}
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="country">Country</InputLabel>
                <TextField
                  fullWidth
                  id="country"
                  placeholder="Enter Country"
                  {...getFieldProps('location.country')}
                  error={Boolean(touched.location?.country && errors.location?.country)}
                  helperText={touched.location?.country && errors.location?.country}
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="postal_code">Postal Code</InputLabel>
                <TextField
                  fullWidth
                  id="postal_code"
                  placeholder="Enter Postal Code"
                  {...getFieldProps('location.postal_code')}
                  error={Boolean(touched.location?.postal_code && errors.location?.postal_code)}
                  helperText={touched.location?.postal_code && errors.location?.postal_code}
                />
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          <Button color="error" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {shipyard ? 'Edit' : 'Add'}
          </Button>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
};

export default FormAdd;
