import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  Box,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { deleteDockingPlaceAction } from "../../redux/features/docking-places/actions";

/**
 * DeleteDockingPlaceDialog Component
 * Confirmation dialog for deleting docking places
 *
 * @param {Object} props
 * @param {boolean} props.open - Dialog open state
 * @param {Object} props.dockingPlace - Docking place to delete
 * @param {Function} props.onClose - Callback to close dialog
 */
const DeleteDockingPlaceDialog = ({ open, dockingPlace, onClose }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      dispatch(deleteDockingPlaceAction(dockingPlace.id));
      onClose();
    } catch (error) {
      console.error("Error deleting docking place:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!dockingPlace) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">Delete Docking Place</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. Please confirm deletion.
          </Alert>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the docking place{" "}
            <strong>{dockingPlace.place_name}</strong>?
          </DialogContentText>

          {dockingPlace.is_used && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Warning: This docking place is currently in use. Deleting it may
              affect ongoing operations.
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDockingPlaceDialog;
