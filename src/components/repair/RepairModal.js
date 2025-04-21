// material-ui
import { Modal } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import FormAddEditRepair from './FormAddEditRepair';

const RepairModal = ({ open, modalToggler, shipyard, repair, dockingNames }) => {
  return (
    <>
      {open && (
        <Modal
          open={open}
          //   onClose={modalToggler}
          aria-labelledby="modal-user-add-label"
          aria-describedby="modal-user-add-description"
          sx={{
            '& .MuiPaper-root:focus': {
              outline: 'none'
            }
          }}
        >
          <MainCard
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar
              sx={{
                maxHeight: `calc(100vh - 48px)`,
                '& .simplebar-content': {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }}
            >
              <FormAddEditRepair shipyard={shipyard} closeModal={modalToggler} repair={repair} dockingNames={dockingNames} />
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

export default RepairModal;
