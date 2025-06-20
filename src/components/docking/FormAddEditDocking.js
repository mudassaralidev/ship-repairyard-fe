import React, { useState } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  MenuItem,
  Autocomplete,
  Typography
} from '@mui/material';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { clearSuccessMessage } from '../../redux/features/dockings/slice';
import { toast } from 'react-toastify';
import useAuth from 'hooks/useAuth';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { createDocking, updateDocking } from '../../redux/features/dockings/actions';

const validationSchema = Yup.object().shape({
  shipyard_id: Yup.string().required('Shipyard is required'),
  start_date: Yup.date().required('Start date is required'),
  end_date: Yup.date().min(Yup.ref('start_date'), 'End date must be after start date').required('End date is required'),
  total_cost: Yup.number().typeError('Total cost must be a number'),
  docking_place_id: Yup.string().required('Docking place is required'),
  ship_id: Yup.string().required('Ship is required'),
  estimated_cost: Yup.number().typeError('Estimated cost must be a number')
});

const FormAddEditDocking = ({ shipyard, docking, ship, dockingPlaces, closeModal, removeUsedPlace = () => {} }) => {
  const { user } = useAuth();
  const [place, setPlace] = useState(docking?.docking_place ? docking.docking_place : null);
  const { successMessage } = useSelector((state) => state.docking);

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      shipyard_id: shipyard?.id || '',
      start_date: docking?.start_date || '',
      end_date: docking?.end_date || '',
      total_cost: docking?.total_cost || 0,
      docking_place_id: docking?.docking_place?.id || '',
      ship_id: docking?.ship?.id || ship?.id || '',
      superintendent_id: docking?.superintendent?.id || null,
      name: docking?.name || '',
      estimated_cost: docking?.estimated_cost || 0
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (ship?.name && place?.place_name) values.name = `${ship.name} (${place.place_name})`;
        values.created_by = user.id;
        if (docking) {
          dispatch(updateDocking(docking.id, values));
        } else {
          dispatch(createDocking(values));
          removeUsedPlace(values.docking_place_id);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || error?.response?.data?.error?.message || 'Some error occurred while creating docking'
        );
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
      closeModal();
    }
  }, [successMessage]);

  const { handleSubmit, getFieldProps, touched, errors, isSubmitting, values, setFieldValue } = formik;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {' '}
      {/* Wrap with LocalizationProvider */}
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>{!docking ? `Create Docking` : `Update Docking`}</DialogTitle>
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

              {/* Ship Select */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <TextField
                    select
                    label="Ship"
                    id="ship_id"
                    {...getFieldProps('ship_id')}
                    error={Boolean(touched.ship_id && errors.ship_id)}
                    helperText={touched.ship_id && errors.ship_id}
                  >
                    <MenuItem key={ship?.id} value={ship?.id}>
                      {ship?.name}
                    </MenuItem>
                  </TextField>
                </Stack>
              </Grid>

              {/* Superintendent User ID Select */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  {docking?.repair_count ? (
                    <TextField
                      select
                      label="Ship"
                      id="superintendent_id"
                      {...getFieldProps('superintendent_id')}
                      error={Boolean(touched.superintendent_id && errors.superintendent_id)}
                      helperText={touched.superintendent_id && errors.superintendent_id}
                    >
                      <MenuItem key={docking?.superintendent?.id} value={docking?.superintendent?.id}>
                        {docking?.superintendent?.name}
                      </MenuItem>
                    </TextField>
                  ) : (
                    <TextField
                      select
                      value={values?.superintendent_id}
                      label="Superintendent"
                      id="superintendent_id"
                      onChange={(e) => setFieldValue('superintendent_id', e.target.value)}
                      // {...getFieldProps('superintendent_id')}
                      error={Boolean(touched.superintendent_id && errors.superintendent_id)}
                      helperText={touched.superintendent_id && errors.superintendent_id}
                    >
                      {ship?.client?.superintendents.map((superintendent) => (
                        <MenuItem key={superintendent?.id} value={superintendent?.id}>
                          {superintendent?.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Stack>
              </Grid>

              {/* Docking Place Select */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={place}
                  options={docking?.docking_place ? [docking.docking_place, ...dockingPlaces] : dockingPlaces}
                  getOptionLabel={(option) => option.place_name}
                  onChange={(e, value) => {
                    setPlace(value);
                    setFieldValue('docking_place_id', value?.id);
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.place_name}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Docking Place"
                      error={touched.docking_place_id && Boolean(errors.docking_place_id)}
                      helperText={touched.docking_place_id && errors.docking_place_id}
                    />
                  )}
                />
                {dockingPlaces.length === 0 && (
                  <Typography sx={{ color: '#FF4D4F', fontSize: '12px', margin: '0px !important' }}>
                    All docking places are occupied
                  </Typography>
                )}
              </Grid>

              {/* Dates Pickers */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <DatePicker
                    label="Start Date"
                    value={values.start_date ? dayjs(values.start_date) : null}
                    format="DD/MM/YYYY"
                    onChange={(newValue) => {
                      formik.setFieldValue('start_date', dayjs(newValue));
                      formik.setFieldValue('end_date', null);
                    }}
                    minDate={docking?.start_date ? (dayjs(docking.start_date) > dayjs() ? dayjs() : dayjs(docking.start_date)) : dayjs()} // Disable past dates
                    slotProps={{
                      textField: {
                        error: Boolean(touched.start_date && errors.start_date),
                        helperText: touched.start_date && errors.start_date
                      }
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <DatePicker
                    label="End Date"
                    value={values.end_date ? dayjs(values.end_date) : null}
                    format="DD/MM/YYYY"
                    onChange={(newValue) => formik.setFieldValue('end_date', dayjs(newValue))}
                    minDate={values.start_date ? dayjs(values.start_date) : dayjs()} // Disable dates before start date
                    disabled={!values.start_date}
                    slotProps={{
                      textField: {
                        error: Boolean(touched.end_date && errors.end_date),
                        helperText: touched.end_date && errors.end_date
                      }
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <TextField
                    label="Estimated Cost"
                    id="estimated_cost"
                    placeholder="Enter Estimated Cost"
                    type="number"
                    {...getFieldProps('estimated_cost')}
                    error={touched.estimated_cost && Boolean(errors.estimated_cost)}
                    helperText={touched.estimated_cost && errors.estimated_cost}
                  />
                </Stack>
              </Grid>
              {docking && (
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <TextField
                      label="Total Cost"
                      id="total_cost"
                      placeholder="Enter Total Cost"
                      type="number"
                      {...getFieldProps('total_cost')}
                      error={touched.total_cost && Boolean(errors.total_cost)}
                      helperText={touched.total_cost && errors.total_cost}
                    />
                  </Stack>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <Divider />

          <DialogActions sx={{ p: 2.5 }}>
            <Button color="error" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting || (!docking && !dockingPlaces?.length)}>
              {docking ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </LocalizationProvider>
  );
};

export default FormAddEditDocking;
