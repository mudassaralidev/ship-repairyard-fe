import React, { useEffect } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack, TextField, MenuItem, Autocomplete } from '@mui/material';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { clearSuccessMessage } from '../../redux/features/ships/slice';
import { toast } from 'react-toastify';
import { createShip, updateShip } from '../../redux/features/ships/actions';
import useAuth from 'hooks/useAuth';

const validationSchema = Yup.object().shape({
  shipyard_id: Yup.string().required('Shipyard is required'),
  name: Yup.string().required('Ship name is required, please enter ship name'),
  type: Yup.string().nullable(),
  length: Yup.number().nullable(),
  beam: Yup.number().nullable(),
  draft: Yup.number().nullable(),
  gross_tonnage: Yup.number().nullable(),
  net_tonnage: Yup.number().nullable(),
  year_built: Yup.number().integer().nullable(),
  classification: Yup.string().nullable(),
  flag: Yup.string().nullable(),
  client_user_id: Yup.string().required('Company is required, Please select company')
});

const FormAddEditShip = ({ shipyard, clients, ship, closeModal }) => {
  const dispatch = useDispatch();
  const { successMessage, status } = useSelector((state) => state.ship);
  const { user } = useAuth();

  const formik = useFormik({
    initialValues: {
      shipyard_id: shipyard?.id ?? '',
      name: ship?.name || '',
      type: ship?.type || null,
      length: ship?.length || null,
      beam: ship?.beam || null,
      draft: ship?.draft || null,
      gross_tonnage: ship?.gross_tonnage || null,
      net_tonnage: ship?.net_tonnage || null,
      year_built: ship?.year_built || null,
      classification: ship?.classification || null,
      flag: ship?.flag || null,
      client_user_id: ship?.client?.id || ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        Object.keys(values).forEach((key) => {
          if (!values[key]) values[key] = null;
        });

        if (ship) {
          dispatch(updateShip(ship.id, values));
        } else {
          values.created_by = user.id;
          dispatch(createShip(values));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const { handleSubmit, getFieldProps, touched, errors, isSubmitting, setFieldValue } = formik;

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
      closeModal();
    }

    if (status === 'failed') {
      closeModal();
      dispatch(clearSuccessMessage());
    }
  }, [successMessage, status]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <DialogTitle>{ship ? 'Update Ship' : 'New Ship'}</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          <Grid container spacing={3}>
            {/* Shipyard Select */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <TextField
                  select
                  label="Shipyard"
                  id="shipyard_id"
                  {...getFieldProps('shipyard_id')}
                  error={Boolean(touched.shipyard_id && errors.shipyard_id)}
                  helperText={touched.shipyard_id && errors.shipyard_id}
                >
                  <MenuItem key={shipyard.id} value={shipyard.id}>
                    {shipyard.name}
                  </MenuItem>
                </TextField>
              </Stack>
            </Grid>

            {/* Client User ID Select */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Autocomplete
                  id="client_user_id"
                  defaultValue={ship?.client || null}
                  options={clients}
                  getOptionLabel={(option) => option.name}
                  onChange={(_, value) => setFieldValue('client_user_id', value ? value.id : '')}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.name}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Company"
                      error={Boolean(touched.client_user_id && errors.client_user_id)}
                      helperText={touched.client_user_id && errors.client_user_id}
                    />
                  )}
                />
              </Stack>
            </Grid>

            {/* Ship Name */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <TextField
                  label="Ship Name"
                  id="name"
                  placeholder="Enter Ship Name"
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Stack>
            </Grid>

            {/* Ship Type */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <TextField label="Ship Type" id="type" placeholder="Enter Ship Type" {...getFieldProps('type')} />
              </Stack>
            </Grid>

            {/* Length */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <TextField label="Length" id="length" placeholder="Enter Length" type="number" {...getFieldProps('length')} />
              </Stack>
            </Grid>

            {/* Beam */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <TextField label="Beam" id="beam" placeholder="Enter Beam" type="number" {...getFieldProps('beam')} />
              </Stack>
            </Grid>

            {/* Draft */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <TextField label="Draft" id="draft" placeholder="Enter Draft" type="number" {...getFieldProps('draft')} />
              </Stack>
            </Grid>

            {/* Gross Tonnage */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <TextField
                  label="Gross Tonnage"
                  id="gross_tonnage"
                  placeholder="Enter Gross Tonnage"
                  type="number"
                  {...getFieldProps('gross_tonnage')}
                />
              </Stack>
            </Grid>

            {/* Net Tonnage */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <TextField
                  label="Net Tonnage"
                  id="net_tonnage"
                  placeholder="Enter Net Tonnage"
                  type="number"
                  {...getFieldProps('net_tonnage')}
                />
              </Stack>
            </Grid>

            {/* Year Built */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <TextField
                  label="Year Built"
                  id="year_built"
                  placeholder="Enter Year Built"
                  type="number"
                  {...getFieldProps('year_built')}
                />
              </Stack>
            </Grid>

            {/* Classification */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <TextField
                  label="Classification"
                  id="classification"
                  placeholder="Enter Classification"
                  {...getFieldProps('classification')}
                />
              </Stack>
            </Grid>

            {/* Flag */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <TextField label="Flag" id="flag" placeholder="Enter Flag" {...getFieldProps('flag')} />
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
            {ship ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditShip;
