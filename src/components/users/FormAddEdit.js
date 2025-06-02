import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  MenuItem
} from '@mui/material';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { openSnackbar } from 'api/snackbar';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from 'hooks/useAuth';
import { clearSuccessMessage } from '../../redux/features/shipyard/slice';
import { roleBasedUserCreation, getFieldsByRole } from 'utils/constants';
import { createUserSY, updateUserSY } from '../../redux/features/shipyard/actions';

const getInitialValues = (user) => {
  const { role, shipyard_id } = user;
  delete user.password;
  const baseValues = {
    shipyard_id: shipyard_id ?? '',
    role_id: role?.id ?? '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    client_user_id: '',
    department_id: '',
    foreman_id: '',
    address: ''
  };

  return user ? { ...baseValues, ...user } : baseValues;
};

const validationSchemas = (user) => ({
  default: Yup.object().shape({
    shipyard_id: Yup.string().required('Shipyard is required'),
    role_id: Yup.string().required('Role is required'),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string(),
    email: Yup.string().email('Invalid email').required('Email is required'),
    ...(!user ? { password: Yup.string().required('Password is required') } : {}),
    phone: Yup.string().required('Contact is required')
  }),
  CLIENT: Yup.object().shape({
    shipyard_id: Yup.string().required('Shipyard is required'),
    role_id: Yup.string().required('Role is required'),
    first_name: Yup.string().required('First name is required'),
    phone: Yup.string().required('Contact is required')
  }),
  SUPERINTENDENT: Yup.object().shape({
    shipyard_id: Yup.string().required('Shipyard is required'),
    role_id: Yup.string().required('Role is required'),
    first_name: Yup.string().required('First name is required'),
    phone: Yup.string().required('Contact is required')
  }),
  FOREMAN: Yup.object().shape({
    shipyard_id: Yup.string().required('Shipyard is required'),
    role_id: Yup.string().required('Role is required'),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string(),
    email: Yup.string().email('Invalid email').required('Email is required'),
    ...(!user ? { password: Yup.string().required('Password is required') } : {}),
    phone: Yup.string().required('Contact is required'),
    department_id: Yup.string().required('Department is required')
  }),
  EMPLOYEE: Yup.object().shape({
    shipyard_id: Yup.string().required('Shipyard is required'),
    role_id: Yup.string().required('Role is required'),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string(),
    phone: Yup.string().required('Contact is required'),
    department_id: Yup.string().required('Department is required')
  }),
  TECHNICAL_PURCHASER: Yup.object().shape({
    shipyard_id: Yup.string().required('Shipyard is required'),
    role_id: Yup.string().required('Role is required'),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string(),
    email: Yup.string().email('Invalid email').required('Email is required'),
    ...(!user ? { password: Yup.string().required('Password is required') } : {}),
    phone: Yup.string().required('Contact is required')
  })
});

const FormAddUser = ({ user, closeModal, shipyard, roleMap, department }) => {
  const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.role);
  const { successMessage, status } = useSelector((state) => state.shipyard);
  const { user: currentUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState(user?.role?.name || '');

  useEffect(() => {
    if (successMessage) {
      openSnackbar({
        open: true,
        message: successMessage,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: { color: 'success' }
      });
      dispatch(clearSuccessMessage());
      closeModal();
    }

    if (status === 'failed') {
      closeModal();
      dispatch(clearSuccessMessage());
    }
  }, [successMessage, status]);

  const formik = useFormik({
    initialValues: getInitialValues(
      user
        ? { ...user, shipyard_id: shipyard.value, department_id: department?.value || '' }
        : { shipyard_id: shipyard.value, department_id: department?.value || '' }
    ),
    validationSchema: validationSchemas(user)[selectedRole] ?? validationSchemas(user).default,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let data = {};
        Object.keys(values).forEach((key) => {
          if (Boolean(values[key])) data[key] = values[key];
        });

        if (user) {
          dispatch(updateUserSY(user.id, data));
        } else {
          data.created_by = currentUser.id;
          dispatch(createUserSY({ shipyard_id: data.shipyard_id, data }));
        }
        setSubmitting(false);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setValues, setFieldValue, setTouched, values } = formik;
  const { department_id, shipyard_id, role_id } = values;

  const handleRoleChange = async (role_id) => {
    setTouched({});
    await setValues(getInitialValues({ role_id, shipyard_id, department_id }), false);
    setSelectedRole(roles.filter(({ id }) => id === role_id)[0]?.name);
  };

  const renderFormFields = (fields) => {
    return fields.map(({ key, label, type, options, colVal, emptyDataMsg }) => (
      <Grid item xs={12} sm={colVal} key={key}>
        <Stack spacing={1}>
          {type === 'select' ? (
            <TextField
              select
              id={key}
              label={label}
              value={key === 'shipyard_id' ? shipyard_id : getFieldProps(key).value}
              {...getFieldProps(key)}
              onChange={(e) => {
                const selectedValue = e.target ? e.target.value : '';
                if (key === 'role_id') handleRoleChange(selectedValue);
              }}
              error={Boolean(touched[key] && errors[key])}
              helperText={touched[key] && errors[key]}
            >
              {options.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          ) : type === 'autocomplete' ? (
            <>
              <Autocomplete
                label={label}
                id={key}
                options={options}
                getOptionLabel={(option) => option.label || ''}
                onChange={(_, value) => {
                  const selectedValue = value ? value.value : '';

                  if (key === 'role_id') handleRoleChange(selectedValue);
                }}
                renderInput={(params) => <TextField {...params} label={label} error={Boolean(touched[key] && errors[key])} />}
              />
              {!options.length && emptyDataMsg && (
                <Typography variant="caption" color="error">
                  {emptyDataMsg}
                </Typography>
              )}
              {Boolean(touched[key] && errors[key]) && (
                <Typography variant="caption" color="error">
                  {errors[key]}
                </Typography>
              )}
            </>
          ) : (
            <TextField
              label={label}
              id={key}
              placeholder={`Enter ${label}`}
              {...getFieldProps(key)}
              error={Boolean(touched[key] && errors[key])}
              helperText={touched[key] && errors[key]}
            />
          )}
        </Stack>
      </Grid>
    ));
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <DialogTitle>{user ? 'Edit User' : 'New User'}</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          <Grid container spacing={3}>
            {renderFormFields(
              getFieldsByRole({
                shipyards: [shipyard],
                role: roles.filter(({ id }) => id === role_id)[0]?.name ?? selectedRole,
                roles: user?.role?.id //edit the user detail but not to change its role
                  ? roles.filter(({ id }) => id === user?.role?.id).map(({ id, name }) => ({ label: name, value: id }))
                  : roles
                      .filter(({ name }) => roleBasedUserCreation(roleMap ? roleMap : currentUser.role).includes(name))
                      .map(({ id, name }) => ({ label: name, value: id })),
                departments: department ? [department] : [],
                shipyard_id
              })
            )}
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          <Button color="error" onClick={() => closeModal()}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {user ? 'Edit' : 'Add'}
          </Button>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
};

export default FormAddUser;
