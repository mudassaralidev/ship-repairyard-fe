// material-ui
import { Modal } from '@mui/material';

// project-imports
import FormShipyardAdd from './FormAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';

const ShipyardModal = ({ open, modalToggler, shipyard }) => {
  const closeModal = () => modalToggler(false);

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-shipyard-add-label"
          aria-describedby="modal-shipyard-add-description"
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
              <FormShipyardAdd shipyard={shipyard || null} closeModal={closeModal} />
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

export default ShipyardModal;
