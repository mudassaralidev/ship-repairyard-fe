import React, { useEffect } from "react";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import useAuth from "hooks/useAuth";
import {
  createNewInventory,
  updateExistingInventory,
} from "../../redux/features/inventory/actions";
import { useDispatch, useSelector } from "react-redux";
import { clearSuccessMessage } from "../../redux/features/inventory/slice";

const FormAddEditInventory = ({ shipyard, inventory, closeModal, repair }) => {
  const { user } = useAuth();

  const { successMessage } = useSelector((state) => state.inventory);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: inventory?.name || "",
      total_quantity: inventory?.total_quantity || "",
      unit_price: inventory?.unit_price || "",
      ...(inventory
        ? { remaining_quantity: inventory?.remaining_quantity || "" }
        : {}),
      repair_id: repair ? repair.id : null,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required("Inventory name is required")
        .max(255, "Name is too long"),
      total_quantity: Yup.number()
        .required("Total quantity is required")
        .min(1, "Total quantity must be at least 1"),
      unit_price: Yup.number()
        .typeError("Unit price must be a number")
        .required("Unit price is required")
        .moreThan(0, "Unit price must be greater than 0"),
      ...(inventory
        ? {
            remaining_quantity: Yup.number()
              .min(0, "Remaining quantity cannot be negative")
              .test(
                "is-less-than-total",
                "Remaining quantity cannot exceed total quantity",
                function (value) {
                  const { total_quantity } = this.parent;
                  return value <= total_quantity;
                },
              ),
          }
        : {}),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (
          typeof values.remaining_quantity === "string" &&
          values.remaining_quantity?.trim() === ""
        )
          delete values.remaining_quantity;

        if (inventory) {
          dispatch(updateExistingInventory(shipyard.id, inventory.id, values));
        } else {
          dispatch(
            createNewInventory(shipyard.id, {
              ...values,
              created_by: user?.id,
            }),
          );
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Something went wrong!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting } = formik;

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
      closeModal();
    }
  }, [successMessage]);

  return (
    <FormikProvider value={formik}>
      <Form noValidate onSubmit={handleSubmit}>
        <DialogTitle>
          {inventory ? "Update Inventory" : "Add Inventory"}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <TextField
                  select
                  value={shipyard.id}
                  label="Shipyard"
                  id="shipyard_id"
                  error={Boolean(touched.shipyard_id && errors.shipyard_id)}
                  helperText={touched.shipyard_id && errors.shipyard_id}
                >
                  <MenuItem key={shipyard.id} value={shipyard.id}>
                    {shipyard.name}
                  </MenuItem>
                </TextField>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <TextField
                  fullWidth
                  label="Inventory Name"
                  {...getFieldProps("name")}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <TextField
                  type="number"
                  fullWidth
                  label="Total Quantity"
                  {...getFieldProps("total_quantity")}
                  error={Boolean(
                    touched.total_quantity && errors.total_quantity,
                  )}
                  helperText={touched.total_quantity && errors.total_quantity}
                />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <TextField
                  type="number"
                  fullWidth
                  label="Unit Price"
                  inputProps={{ min: 0, step: "0.01" }}
                  {...getFieldProps("unit_price")}
                  error={Boolean(touched.unit_price && errors.unit_price)}
                  helperText={touched.unit_price && errors.unit_price}
                />
              </Stack>
            </Grid>

            {inventory && (
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <TextField
                    type="number"
                    fullWidth
                    label="Remaining Quantity"
                    {...getFieldProps("remaining_quantity")}
                    error={Boolean(
                      touched.remaining_quantity && errors.remaining_quantity,
                    )}
                    helperText={
                      touched.remaining_quantity && errors.remaining_quantity
                    }
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
            {inventory ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditInventory;
