import React, { useEffect, useState } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack, TextField, MenuItem, Autocomplete } from '@mui/material';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from 'hooks/useAuth';
import { createRepair, updateRepair } from '../../redux/features/repair/actions';
import { clearSuccessMessage } from '../../redux/features/repair/slice';

const validationSchema = (repair) =>
  Yup.object().shape({
    description: Yup.string().nullable(),
    start_date: Yup.date().nullable(),
    end_date: Yup.date().nullable().min(Yup.ref('start_date'), 'End date must be after start date'),
    estimated_cost: Yup.number()
      .typeError('Estimated cost must be a number')
      .required('Estimated cost is required')
      .positive('Estimated cost must be a positive number'),
    //   total_cost: Yup.number().typeError('Total cost must be a number').nullable().positive('Total cost must be a positive number'),
    requires_work_order: Yup.boolean(),
    requires_subcontractor: Yup.boolean(),
    //   docking_id: Yup.number().required('Docking is required'),
    shipyard_id: Yup.number().required('Shipyard is required'),
    status: Yup.string().oneOf(['INITIATED', 'APPROVED', 'BLOCKED', 'COMPLETED']).required('Status is required'),
    ...(repair
      ? {
          change_request: Yup.string().required('Select request change'),
          updated_reason: Yup.string().required('Enter the reason of change/update')
        }
      : {})
  });

const getStatusOptions = (userRole, isCreate) => {
  if (isCreate) return ['INITIATED'];
  switch (userRole) {
    case 'CALCULATOR_ENGINEER':
      return ['INITIATED'];
    case 'ADMIN':
      return ['INITIATED', 'APPROVED', 'BLOCKED', 'COMPLETED'];
    case 'PROJECT_MANAGER':
      return ['INITIATED', 'APPROVED', 'BLOCKED', 'COMPLETED'];
    default:
      return [];
  }
};

const FormAddEditRepair = ({ shipyard, repair, closeModal, dockingNames = [] }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { successMessage } = useSelector((state) => state.repair);
  const [repairDocking, setRepairDocking] = useState(dockingNames.find((d) => d.id === repair?.docking?.id) || null);

  const formik = useFormik({
    initialValues: {
      description: repair?.description || '',
      start_date: repair?.start_date || '',
      end_date: repair?.end_date || '',
      estimated_cost: repair?.estimated_cost || '',
      requires_work_order: repair?.requires_work_order || '',
      requires_subcontractor:
        repair?.requires_subcontractor?.toString() === 'true' ? true : repair?.requires_subcontractor?.toString() === 'false' ? false : '',
      updated_reason: '',
      docking_id: repairDocking?.id || '',
      shipyard_id: shipyard?.id || '',
      status: repair?.status || 'INITIATED',
      change_request: ''
    },
    validationSchema: validationSchema(repair),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (repair) {
          dispatch(updateRepair(repair.id, values));
        } else {
          values.created_by = user.id;
          dispatch(createRepair(values));
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || error?.response?.data?.error?.message || 'Some error occurred while processing the repair'
        );
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const { handleSubmit, getFieldProps, touched, errors, isSubmitting, values, setFieldValue } = formik;

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
      closeModal();
    }
  }, [successMessage]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>{repair ? 'Update Repair' : 'Create Repair'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
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

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  {repair?.work_order_count ? (
                    <TextField
                      select
                      label="Docking"
                      id="docking_id"
                      {...getFieldProps('docking_id')}
                      error={Boolean(touched.docking_id && errors.docking_id)}
                      helperText={touched.docking_id && errors.docking_id}
                    >
                      <MenuItem key={repairDocking?.id} value={repairDocking?.id}>
                        {repairDocking?.name}
                      </MenuItem>
                    </TextField>
                  ) : (
                    <Autocomplete
                      value={repairDocking}
                      options={dockingNames}
                      getOptionLabel={(option) => option.name}
                      onChange={(e, value) => {
                        setRepairDocking(value);
                        setFieldValue('docking_id', value?.id || null);
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Docking"
                          error={touched.docking_id && Boolean(errors.docking_id)}
                          helperText={touched.docking_id && errors.docking_id}
                        />
                      )}
                    />
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <TextField
                    select
                    fullWidth
                    label="Status"
                    {...getFieldProps('status')}
                    error={Boolean(touched.status && errors.status)}
                    helperText={touched.status && errors.status}
                  >
                    {getStatusOptions(user?.role, !repair).map((statusOption) => (
                      <MenuItem key={statusOption} value={statusOption}>
                        {statusOption.charAt(0) + statusOption.slice(1).toLowerCase()}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <TextField
                    label="Estimated Cost"
                    {...getFieldProps('estimated_cost')}
                    error={Boolean(touched.estimated_cost && errors.estimated_cost)}
                    helperText={touched.estimated_cost && errors.estimated_cost}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={12}>
                <Stack spacing={1}>
                  <TextField label="Description" multiline minRows={3} {...getFieldProps('description')} />
                </Stack>
              </Grid>

              {/* <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <TextField
                    label="Total Cost"
                    {...getFieldProps('total_cost')}
                    error={Boolean(touched.total_cost && errors.total_cost)}
                    helperText={touched.total_cost && errors.total_cost}
                  />
                </Stack>
              </Grid> */}

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <TextField
                    select
                    label="Requires Work Order"
                    {...getFieldProps('requires_work_order')}
                    onChange={(e) => {
                      const value = e.target.value === 'true' || e.target.value === true;
                      formik.setFieldValue('requires_work_order', value);
                      if (value) {
                        formik.setFieldValue('requires_subcontractor', false);
                      }
                    }}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </TextField>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <TextField
                    select
                    label="Requires Subcontractor"
                    {...getFieldProps('requires_subcontractor')}
                    onChange={(e) => {
                      const value = e.target.value === 'true' || e.target.value === true;
                      formik.setFieldValue('requires_subcontractor', value);
                      if (value) {
                        formik.setFieldValue('requires_work_order', false);
                      }
                    }}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </TextField>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <DatePicker
                    label="Start Date"
                    value={values.start_date ? dayjs(values.start_date) : null}
                    onChange={(newValue) => setFieldValue('start_date', newValue)}
                    format="DD/MM/YYYY"
                    minDate={repair?.start_date ? (dayjs(repair.start_date) > dayjs() ? dayjs() : dayjs(repair.start_date)) : dayjs()}
                    slotProps={{
                      textField: {
                        error: Boolean(touched.start_date && errors.start_date),
                        helperText: touched.start_date && errors.start_date
                      }
                    }}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <DatePicker
                    label="End Date"
                    value={values.end_date ? dayjs(values.end_date) : null}
                    onChange={(newValue) => setFieldValue('end_date', newValue)}
                    format="DD/MM/YYYY"
                    minDate={values.start_date ? dayjs(values.start_date) : dayjs()} // Disable dates before start date
                    disabled={!values.start_date}
                    slotProps={{
                      textField: {
                        error: Boolean(touched.end_date && errors.end_date),
                        helperText: touched.end_date && errors.end_date
                      }
                    }}
                  />
                </Stack>
              </Grid>

              {repair && (
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <TextField
                      select
                      label="Request Change"
                      {...getFieldProps('change_request')}
                      error={Boolean(touched.change_request && errors.change_request)}
                      helperText={touched.change_request && errors.change_request}
                    >
                      {['Self (manager or administrator user)', 'Superintendent', 'Other'].map((changeReason) => (
                        <MenuItem value={changeReason}>{changeReason}</MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                </Grid>
              )}

              {repair && (
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <TextField
                      label="Why this repair is being updated"
                      multiline
                      minRows={1}
                      {...getFieldProps('updated_reason')}
                      error={Boolean(touched.updated_reason && errors.updated_reason)}
                      helperText={touched.updated_reason && errors.updated_reason}
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
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {repair ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </LocalizationProvider>
  );
};

export default FormAddEditRepair;
