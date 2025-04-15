import React from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, MenuItem, Typography, Stack } from '@mui/material';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { clearSuccessMessage } from '../../redux/features/dockings/slice';
import { toast } from 'react-toastify';
import { updateDocking } from '../../redux/features/dockings/actions';

const validationSchema = Yup.object().shape({
  superintendent_id: Yup.string().required('Superintendent ID is required')
});

const FormAddSuperintendent = ({ dockID, clientName, superintendents, closeModal }) => {
  const { successMessage, status } = useSelector((state) => state.docking);

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      superintendent_id: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        dispatch(updateDocking(dockID, values));
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const { handleSubmit, touched, errors, values, setFieldValue, isSubmitting } = formik;

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
        <DialogTitle>{`Assign Superintendent`}</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          {superintendents?.length ? (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <Stack spacing={1}>
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
                    {superintendents.map((superintendent) => (
                      <MenuItem key={superintendent?.id} value={superintendent?.id}>
                        {superintendent?.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Grid>
            </Grid>
          ) : (
            <Typography>
              There are no superintendents created for company <strong>{clientName}</strong>
            </Typography>
          )}
        </DialogContent>
        <Divider />

        <DialogActions sx={{ p: 2.5 }}>
          <Button color="error" onClick={closeModal}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Assign
          </Button>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
};

export default FormAddSuperintendent;
