// material-ui
import { Modal, Stack } from "@mui/material";

// project-imports
import MainCard from "components/MainCard";
import SimpleBar from "components/third-party/SimpleBar";
import { useEffect, useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
} from "@mui/material";
import { updateSYUser } from "../../redux/features/shipyard/slice";
import { useDispatch } from "react-redux";
import { openSnackbar } from "api/snackbar";
import PaginatedAutocomplete from "components/@extended/PaginatedAutocomplete";
import { fetchClientsOptionsApi } from "api/shipyard";
import { assignClientAPI } from "api/user";

const ClientAssignmentModal = ({
  open,
  modalToggler,
  shipyard_id,
  user: superintendent,
}) => {
  const closeModal = () => modalToggler(false);

  const [selectedClient, setSelectedClient] = useState(
    superintendent?.client || null,
  );

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      const data = await assignClientAPI(superintendent.id, selectedClient.id);
      dispatch(updateSYUser(data));
      openSnackbar({
        open: true,
        message: "Client Assigned Successfully",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        variant: "alert",
        alert: {
          color: "success",
        },
      });
    } catch (error) {
      console.error("Error while assigning client", error);
      openSnackbar({
        open: true,
        message: `Error while assigning client: ${error.message}`,
        anchorOrigin: { vertical: "top", horizontal: "right" },
        variant: "alert",
        alert: {
          color: "error",
        },
      });
    } finally {
      closeModal();
    }
  };

  return (
    <>
      {open && (
        <Modal
          open={open}
          aria-labelledby="modal-user-add-label"
          aria-describedby="modal-user-add-description"
          sx={{
            "& .MuiPaper-root:focus": {
              outline: "none",
            },
          }}
        >
          <MainCard
            sx={{
              width: `calc(100% - 48px)`,
              minWidth: 340,
              maxWidth: 880,
              height: "auto",
              maxHeight: "calc(100vh - 48px)",
            }}
            modal
            content={false}
          >
            <SimpleBar
              sx={{
                maxHeight: `calc(100vh - 48px)`,
                "& .simplebar-content": {
                  display: "flex",
                  flexDirection: "column",
                },
              }}
            >
              <>
                <DialogTitle>
                  {superintendent?.client?.id
                    ? "Update Assigned Company to Superintendent "
                    : "Assign Company to Superintendent"}{" "}
                  "{superintendent?.name}"
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ p: 2.5 }}>
                  <PaginatedAutocomplete
                    label="Select Company"
                    value={selectedClient}
                    extraParams={{ shipyardId: shipyard_id }}
                    fetchOptionsApi={fetchClientsOptionsApi}
                    pageSize={100}
                    getOptionLabel={(option) => option.name}
                    onChange={(value) => setSelectedClient(value)}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Company" />
                    )}
                  />
                </DialogContent>
                <Divider />
                <DialogActions sx={{ p: 2.5 }}>
                  <Button color="error" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!selectedClient}
                    onClick={handleSubmit}
                  >
                    {superintendent?.client?.id ? "Update" : "Assign"}
                  </Button>
                </DialogActions>
              </>
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

export default ClientAssignmentModal;
