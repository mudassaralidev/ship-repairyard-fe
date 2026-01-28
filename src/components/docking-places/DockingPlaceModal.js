import React from "react";
import { Modal } from "@mui/material";
import MainCard from "components/MainCard";
import SimpleBar from "components/third-party/SimpleBar";
import FormAddEditDockingPlace from "./FormAddEditDockingPlace";

/**
 * DockingPlaceModal Component
 * Modal wrapper for docking place form
 *
 * @param {Object} props
 * @param {boolean} props.open - Modal open state
 * @param {Function} props.modalToggler - Callback to toggle modal
 * @param {Object} props.dockingPlace - Existing docking place data (null for creation)
 */
const DockingPlaceModal = ({ open, modalToggler, dockingPlace }) => {
  const closeModal = () => modalToggler(false);

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-docking-place-label"
          aria-describedby="modal-docking-place-description"
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
              <FormAddEditDockingPlace
                dockingPlace={dockingPlace}
                closeModal={closeModal}
              />
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

export default DockingPlaceModal;
