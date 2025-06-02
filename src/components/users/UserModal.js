// material-ui
import { Modal } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import FormAddUser from './FormAddEdit';

const UserModal = ({ open, modalToggler, user, shipyard, roleMap, department }) => {
  return (
    <>
      {open && (
        <Modal
          open={open}
          // onClose={() => modalToggler()}
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
              <FormAddUser user={user || null} closeModal={modalToggler} shipyard={shipyard} roleMap={roleMap} department={department} />
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

export default UserModal;
