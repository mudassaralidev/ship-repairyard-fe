import React, { useEffect, useState } from "react";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import useAuth from "hooks/useAuth";
import { createInventoryOrder, updateInventoryOrderApi } from "api/repair";
import { useDispatch, useSelector } from "react-redux";
import {
  updateInventoryOrder,
  createInventoryOrder as createInvOrderState,
} from "../../redux/features/work-order/slice";
import PaginatedAutocomplete from "components/@extended/PaginatedAutocomplete";
import { fetchInventoryOptionsApi } from "api/shipyard";
import { currencyFormatter } from "utils/currenyFormaterr";

const FormAddEditInventoryOrder = ({ repair, closeModal, inventoryOrder }) => {
  const [selectedInventory, setSelectedInventory] = useState(null);
  const dispatch = useDispatch();
  const { shipyard } = useSelector((state) => state.shipyard);

  const { user } = useAuth();

  const formik = useFormik({
    initialValues: {
      inventory_id: inventoryOrder?.inventory?.id || "",
      quantity: inventoryOrder?.quantity || "",
      cost: inventoryOrder?.cost || "",
    },
    validationSchema: Yup.object().shape({
      inventory_id: Yup.number().required("Inventory is required"),
      quantity: Yup.number()
        .required("Quantity is required")
        .min(1, "Quantity must be at least 1")
        .max(
          selectedInventory?.remaining_quantity || 0,
          `Quantity must be less than or equal to remaining quantity (${selectedInventory?.remaining_quantity})`,
        ),
      cost: Yup.number()
        .required("Cost is required")
        .min(0, "Cost cannot be negative"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (inventoryOrder) {
          const data = await updateInventoryOrderApi(
            repair.id,
            inventoryOrder.id,
            values,
          );
          dispatch(updateInventoryOrder(data));
        } else {
          values.created_by = user?.id;
          const data = await createInventoryOrder(repair.id, values);
          dispatch(createInvOrderState(data));
        }

        toast.success(
          inventoryOrder
            ? "Order updated successfully"
            : "Order created successfully",
        );
        closeModal();
      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data?.message ||
            "Something went wrong while creating Inventory Order!",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    isSubmitting,
    setFieldValue,
  } = formik;

  const quantity = Number(formik.values.quantity);
  const unitPrice = Number(selectedInventory?.unit_price);

  const calculatedCost =
    selectedInventory && quantity && unitPrice
      ? Number((quantity * unitPrice).toFixed(2))
      : null;

  useEffect(() => {
    if (calculatedCost !== null) {
      formik.setFieldValue("cost", calculatedCost);
    }
  }, [calculatedCost]);

  return (
    <FormikProvider value={formik}>
      <Form noValidate onSubmit={handleSubmit}>
        <DialogTitle>
          {inventoryOrder ? "Update Material Order" : "Add Material Order"}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <PaginatedAutocomplete
                  label="Inventory"
                  value={selectedInventory}
                  fetchOptionsApi={fetchInventoryOptionsApi}
                  extraParams={{ shipyardId: shipyard.id }}
                  pageSize={100}
                  getOptionLabel={(option) => option.name}
                  onChange={(value) => {
                    setSelectedInventory(value);
                    setFieldValue("inventory_id", value?.id || "");
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
                  }
                />
              </Stack>
              {selectedInventory && (
                <Typography
                  sx={{
                    color: "#295dd1",
                    fontSize: "12px",
                    margin: "0px !important",
                  }}
                >
                  Note: remaining Quantity for this inventory is{" "}
                  {selectedInventory.remaining_quantity}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <TextField
                  type="number"
                  fullWidth
                  label="Quantity"
                  {...getFieldProps("quantity")}
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
                  {...getFieldProps("cost")}
                  error={Boolean(touched.cost && errors.cost)}
                  helperText={touched.cost && errors.cost}
                />
                {calculatedCost !== null && (
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "text.secondary",
                      mt: 0.5,
                    }}
                  >
                    Calculated cost:{" "}
                    <strong>{currencyFormatter(calculatedCost)}</strong>
                    (Quantity {quantity} × Unit price {unitPrice}). You can
                    change it accordingly.
                  </Typography>
                )}
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
            {inventoryOrder ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditInventoryOrder;
