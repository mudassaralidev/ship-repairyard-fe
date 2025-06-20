import React, { useEffect, useState } from 'react';
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
  Box,
  Typography
} from '@mui/material';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from 'hooks/useAuth';
import { clearSuccessMessage } from '../../redux/features/work-order/slice';
import { createWorkOrder, updateWorkOrder } from '../../redux/features/work-order/actions';

const validationSchema = (workOrder) =>
  Yup.object().shape({
    description: Yup.string().nullable(),
    start_date: Yup.date().nullable(),
    total_hours: Yup.number()
      .nullable()
      .max(16, 'Work order can not be exceeded 16 hours.')
      .when('status', {
        is: 'COMPLETED',
        then: (schema) => schema.required('Total hours are required when status is COMPLETED')
      }),
    end_date: Yup.date().nullable().min(Yup.ref('start_date'), 'End date must be after start date'),
    total_cost: Yup.number().nullable(),
    repair_id: Yup.number().required('Repair is required'),
    foreman_id: Yup.number().required('Foreman or department is required'),
    status: Yup.string().nullable(),
    per_hour_cost: Yup.number()
      .nullable()
      .when('status', {
        is: 'COMPLETED',
        then: (schema) => schema.required('Per hour cost is required when status is COMPLETED')
      })
  });

const getStatusOptions = (userRole, workOrder) => {
  if (['ADMIN', 'FOREMAN', 'PROJECT_MANAGER'].includes(userRole)) {
    return workOrder ? ['STARTED', 'BLOCKED', 'COMPLETED'] : ['STARTED'];
  } else {
    return [];
  }
};

const FormAddEditWorkOrder = ({ repair, closeModal, workOrder, departments }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { successMessage } = useSelector((state) => state.workOrder);
  const [foreman, setForeman] = useState(workOrder?.foreman ? workOrder?.foreman : {});
  const [selectedDepartment, setSelectedDepartment] = useState(
    workOrder?.foreman ? departments.find((d) => d.foreman.id === workOrder?.foreman.id) : null
  );

  const formik = useFormik({
    initialValues: {
      description: workOrder?.description || '',
      start_date: workOrder?.start_date || '',
      end_date: workOrder?.end_date || '',
      total_hours: workOrder?.total_hours || '',
      per_hour_cost: workOrder?.per_hour_cost || '',
      repair_id: repair?.id || '',
      status: workOrder?.status || '',
      foreman_id: foreman?.id || ''
    },
    validationSchema: validationSchema(workOrder),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        for (let key in values) {
          if (!values[key]) delete values[key];
        }

        if (workOrder) {
          dispatch(updateWorkOrder(workOrder.id, values));
        } else {
          values.created_by = user.id;
          dispatch(createWorkOrder(values));
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
          <DialogTitle>{workOrder ? 'Update Work Order' : 'Create Work Order'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <Typography variant="h6">
                  <Box component="span" fontWeight={600} color="#1a237e">
                    Repair Description:
                  </Box>{' '}
                  {repair?.description}
                </Typography>
              </Grid>

              {(!workOrder || !workOrder?.status) && (
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Autocomplete
                      value={selectedDepartment}
                      options={departments}
                      getOptionLabel={(option) => option.name}
                      onChange={(e, value) => {
                        setSelectedDepartment(value);
                        setFieldValue('foreman_id', value?.foreman?.id || '');
                        setForeman(value?.foreman || {});
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => <TextField {...params} label="Department" />}
                    />
                  </Stack>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <TextField
                    select
                    label="Foreman"
                    id="foreman_id"
                    {...getFieldProps('foreman_id')}
                    error={Boolean(touched.foreman_id && errors.foreman_id)}
                    helperText={touched.foreman_id && errors.foreman_id}
                  >
                    <MenuItem key={foreman?.id} value={foreman?.id}>
                      {foreman?.name}
                    </MenuItem>
                  </TextField>
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
                    {getStatusOptions(user?.role, workOrder).map((statusOption) => (
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
                    label="Per Hour Rate/Cost"
                    {...getFieldProps('per_hour_cost')}
                    type="number"
                    error={Boolean(touched.per_hour_cost && errors.per_hour_cost)}
                    helperText={touched.per_hour_cost && errors.per_hour_cost}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={12}>
                <Stack spacing={1}>
                  <TextField label="Description" multiline minRows={3} {...getFieldProps('description')} />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <DatePicker
                    label="Start Date"
                    value={values.start_date ? dayjs(values.start_date) : null}
                    onChange={(newValue) => setFieldValue('start_date', newValue)}
                    format="DD/MM/YYYY"
                    minDate={
                      workOrder?.start_date ? (dayjs(workOrder.start_date) > dayjs() ? dayjs() : dayjs(workOrder.start_date)) : dayjs()
                    }
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
                    maxDate={repair?.end_date ? dayjs(repair.end_date) : null}
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

              {workOrder && (
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <TextField
                      label="Total Hours"
                      {...getFieldProps('total_hours')}
                      type="number"
                      error={Boolean(touched.total_hours && errors.total_hours)}
                      helperText={touched.total_hours && errors.total_hours}
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
              {workOrder ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </LocalizationProvider>
  );
};

export default FormAddEditWorkOrder;
