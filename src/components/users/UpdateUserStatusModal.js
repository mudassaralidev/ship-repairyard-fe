import { useEffect, useState } from "react";
import PropTypes from "prop-types";

// material-ui
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Modal,
  Stack,
  TextField,
} from "@mui/material";

// project imports
import MainCard from "components/MainCard";
import SimpleBar from "components/third-party/SimpleBar";
import { useDispatch } from "react-redux";
import { updateUserSY } from "../../redux/features/shipyard/actions";

const EMPLOYEE_STATUSES = [
  { label: "Free", value: "FREE" },
  { label: "Occupied", value: "OCCUPIED" },
  { label: "Out of Sick", value: "ON_LEAVE" },
];

const UpdateUserStatusModal = ({
  open,
  modalToggler,
  userId,
  currentStatus,
}) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(currentStatus || "");

  useEffect(() => {
    setStatus(currentStatus || "");
  }, [currentStatus]);

  const handleUpdate = () => {
    if (status === currentStatus) {
      modalToggler();
      return;
    }

    dispatch(updateUserSY(userId, { status }));
    modalToggler();
  };

  return (
    <>
      {open && (
        <Modal
          open={open}
          aria-labelledby="update-user-status-modal"
          sx={{
            "& .MuiPaper-root:focus": { outline: "none" },
          }}
        >
          <MainCard
            sx={{
              width: `calc(100% - 48px)`,
              minWidth: 340,
              maxWidth: 480,
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
              <FormControl>
                <DialogTitle>Update User Status</DialogTitle>
                <Divider />

                <DialogContent sx={{ p: 2.5 }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <TextField
                          select
                          fullWidth
                          label="Status"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          {EMPLOYEE_STATUSES.map(({ label, value }) => (
                            <MenuItem key={value} value={value}>
                              {label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Stack>
                    </Grid>
                  </Grid>
                </DialogContent>

                <Divider />

                <DialogActions sx={{ p: 2.5 }}>
                  <Button color="error" onClick={modalToggler}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleUpdate}>
                    Update Status
                  </Button>
                </DialogActions>
              </FormControl>
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

UpdateUserStatusModal.propTypes = {
  open: PropTypes.bool.isRequired,
  modalToggler: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  currentStatus: PropTypes.string,
};

export default UpdateUserStatusModal;
