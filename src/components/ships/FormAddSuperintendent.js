import React, { useState } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack, TextField, MenuItem, Autocomplete } from '@mui/material';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { getClientSpecificSuperintendents } from 'api/user';
import { useEffect } from 'react';
import { createAndAssignSuperintendent, updateShip } from '../../redux/features/ships/actions';
import { clearSuccessMessage } from '../../redux/features/ships/slice';
import { toast } from 'react-toastify';
import useAuth from 'hooks/useAuth';

const validationSchema = Yup.object().shape({
  shipyard_id: Yup.string().required('Shipyard is required'),
  role_id: Yup.string().required('Role is required'),
  client_user_id: Yup.string().required('Client User ID is required'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string(), // Optional
  phone: Yup.string().required('Phone is required')
});

const FormAddSuperintendent = ({ shipyard, ship, closeModal }) => {
  const { roles } = useSelector((state) => state.role);
  const { successMessage, status } = useSelector((state) => state.ship);
  const { user } = useAuth();
  const [superintendents, setSuperintendents] = useState([]);
  const [showUserForm, setShowNewUserForm] = useState(true);
  const [selectedSuperintendent, setSelectedSuperintendent] = useState(ship?.superintendent || null);

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      shipyard_id: shipyard?.id || '',
      role_id: roles.filter(({ name }) => name === 'SUPERINTENDENT')[0]?.id || '',
      client_user_id: ship?.client?.id || '',
      first_name: '',
      last_name: '',
      phone: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        values.created_by = user.id;
        dispatch(createAndAssignSuperintendent(ship.id, values));
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const { handleSubmit, getFieldProps, touched, errors, isSubmitting } = formik;

  useEffect(() => {
    try {
      (async () => {
        const superintendentUsers = await getClientSpecificSuperintendents(ship.client.id);
        if (superintendentUsers.length) setShowNewUserForm(false);
        setSuperintendents(superintendentUsers);
      })();
    } catch (error) {
      console.error('Error occurred while getting superintendents', error);
      toast.error('Some error occurred, please try again later');
    }
  }, [ship]);

  const handleAssign = () => {
    dispatch(updateShip(ship.id, { superintendent_id: selectedSuperintendent.id, client_user_id: ship.client.id }));
  };

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
        <DialogTitle>
          {ship.superintendent ? `Superintendent to '${ship.name}' Ship` : `Assign Superintendent to ${ship.name} Ship`}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          {superintendents.length && !showUserForm ? (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  value={selectedSuperintendent}
                  options={superintendents}
                  getOptionLabel={(option) => option.name}
                  onChange={(e, value) => setSelectedSuperintendent(value)}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.name}
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} label="Select Superintendent" />}
                />
              </Grid>
            </Grid>
          ) : (
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

              {/* Role Select */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <TextField
                    select
                    label="Role"
                    id="role_id"
                    {...getFieldProps('role_id')}
                    error={Boolean(touched.role_id && errors.role_id)}
                    helperText={touched.role_id && errors.role_id}
                  >
                    {roles
                      .filter(({ name }) => name === 'SUPERINTENDENT')
                      .map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Stack>
              </Grid>

              {/* Client User ID Select */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <TextField
                    select
                    label="Company"
                    id="client_user_id"
                    {...getFieldProps('client_user_id')}
                    error={Boolean(touched.client_user_id && errors.client_user_id)}
                    helperText={touched.client_user_id && errors.client_user_id}
                  >
                    <MenuItem key={ship?.client.id} value={ship?.client.id}>
                      {ship?.client.name}
                    </MenuItem>
                  </TextField>
                </Stack>
              </Grid>

              {/* First Name */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <TextField
                    label="First Name"
                    id="first_name"
                    placeholder="Enter First Name"
                    {...getFieldProps('first_name')}
                    error={Boolean(touched.first_name && errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                  />
                </Stack>
              </Grid>

              {/* Last Name (Optional) */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <TextField
                    label="Last Name"
                    id="last_name"
                    placeholder="Enter Last Name"
                    {...getFieldProps('last_name')}
                    error={Boolean(touched.last_name && errors.last_name)}
                    helperText={touched.last_name && errors.last_name}
                  />
                </Stack>
              </Grid>

              {/* Phone */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <TextField
                    label="Phone"
                    id="phone"
                    placeholder="Enter Phone Number"
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Stack>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <Divider />
        {superintendents.length && !showUserForm ? (
          <DialogActions sx={{ p: 2.5 }}>
            <Button color="error" onClick={closeModal}>
              Cancel
            </Button>
            {!ship.superintendent && (
              <Button variant="outlined" onClick={() => setShowNewUserForm(true)}>
                Add New
              </Button>
            )}
            <Button variant="contained" onClick={handleAssign} disabled={!selectedSuperintendent}>
              {ship.superintendent ? 'Update' : 'Assign'}
            </Button>
          </DialogActions>
        ) : (
          <DialogActions sx={{ p: 2.5 }}>
            <Button color="error" onClick={closeModal}>
              Cancel
            </Button>
            {superintendents.length > 0 && (
              <Button variant="outlined" onClick={() => setShowNewUserForm(false)}>
                Assign Existing
              </Button>
            )}
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Assign
            </Button>
          </DialogActions>
        )}
      </Form>
    </FormikProvider>
  );
};

export default FormAddSuperintendent;
