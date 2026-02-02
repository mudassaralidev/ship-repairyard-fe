import React from "react";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
  createDockingPlace,
  updateDockingPlaceAction,
} from "../../redux/features/docking-places/actions";
import useAuth from "hooks/useAuth";

/**
 * Form validation schema
 */
const validationSchema = Yup.object().shape({
  place_name: Yup.string()
    .required("Docking place name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
});

/**
 * FormAddEditDockingPlace Component
 * Handles creation and editing of docking places with Formik validation
 *
 * @param {Object} props
 * @param {Object} props.dockingPlace - Existing docking place data (null for creation)
 * @param {Function} props.closeModal - Callback to close modal
 */
const FormAddEditDockingPlace = ({ dockingPlace, closeModal }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const formik = useFormik({
    initialValues: {
      place_name: dockingPlace?.place_name || "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (dockingPlace) {
          // Update existing docking place
          dispatch(updateDockingPlaceAction(dockingPlace.id, values));
        } else {
          // Create new docking place
          dispatch(
            createDockingPlace({
              ...values,
              shipyard_id: user?.shipyard_id,
              created_by: user?.id,
            }),
          );
        }
        closeModal();
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting, dirty } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate onSubmit={handleSubmit}>
        <DialogTitle>
          {dockingPlace ? "Update Docking Place" : "Create New Docking Place"}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          <Grid container spacing={3}>
            {dockingPlace && (
              <Grid item xs={12}>
                <Alert severity="info">
                  Docking Place ID: {dockingPlace.id} | Status:{" "}
                  {dockingPlace.is_used}
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Stack spacing={1}>
                <TextField
                  fullWidth
                  label="Docking Place Name"
                  placeholder="e.g., DOCK A, DOCK B, BERTH 1"
                  {...getFieldProps("place_name")}
                  error={Boolean(touched.place_name && errors.place_name)}
                  helperText={touched.place_name && errors.place_name}
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
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || (!dirty && !!dockingPlace)}
          >
            {isSubmitting
              ? "Processing..."
              : dockingPlace
              ? "Update"
              : "Create"}
          </Button>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditDockingPlace;
