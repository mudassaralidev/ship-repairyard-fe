import React, { useState } from 'react';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  MenuItem,
  Button,
  Autocomplete,
  Typography
} from '@mui/material';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import useAuth from 'hooks/useAuth';
import { createInventoryOrder } from 'api/repair';

const FormAddEditInventoryOrder = ({ repair, closeModal, inventoryOrder, inventories }) => {
  const [selectedInventory, setSelectedInventory] = useState(null);

  const { user } = useAuth();

  const formik = useFormik({
    initialValues: {
      inventory_id: inventoryOrder?.inventory_id || '',
      quantity: inventoryOrder?.quantity || '',
      cost: inventoryOrder?.cost || ''
    },
    validationSchema: Yup.object().shape({
      inventory_id: Yup.number().required('Inventory is required'),
      quantity: Yup.number()
        .required('Quantity is required')
        .min(1, 'Quantity must be at least 1')
        .max(
          selectedInventory?.remaining_quantity || 0,
          `Quantity must be less than or equal to remaining quantity (${selectedInventory?.remaining_quantity})`
        ),
      cost: Yup.number().required('Cost is required').min(0, 'Cost cannot be negative')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (inventoryOrder) {
          console.log('updating', values);
        } else {
          values.created_by = user?.id;
          await createInventoryOrder(repair.id, values);
        }

        toast.success(inventoryOrder ? 'Order updated successfully' : 'Order created successfully');
        closeModal();
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Something went wrong while creating Inventory Order!');
      } finally {
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate onSubmit={handleSubmit}>
        <DialogTitle>{inventoryOrder ? 'Update Material Order' : 'Add Material Order'}</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Autocomplete
                  value={selectedInventory}
                  options={inventories}
                  getOptionLabel={(option) => option.name}
                  onChange={(e, value) => {
                    setSelectedInventory(value);
                    setFieldValue('inventory_id', value?.id || '');
                    if (!value) setFieldValue('quantity', '');
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.name}
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} label="Inventory" />}
                />
              </Stack>
              {selectedInventory && (
                <Typography sx={{ color: '#295dd1', fontSize: '12px', margin: '0px !important' }}>
                  Note: remaining Quantity for this inventory is {selectedInventory.remaining_quantity}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <TextField
                  type="number"
                  fullWidth
                  label="Quantity"
                  {...getFieldProps('quantity')}
                  error={Boolean(touched.quantity && errors.quantity)}
                  helperText={touched.quantity && errors.quantity}
                />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <TextField
                  type="number"
                  fullWidth
                  label="Cost"
                  {...getFieldProps('cost')}
                  error={Boolean(touched.cost && errors.cost)}
                  helperText={touched.cost && errors.cost}
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
            {inventoryOrder?.inventory_id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditInventoryOrder;
