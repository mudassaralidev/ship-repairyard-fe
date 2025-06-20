import { Fragment, useEffect, useMemo, useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

// project-import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';

import { DebouncedInput, RowSelection, TablePagination } from 'components/third-party/react-table';

// assets
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { userTableColumns } from 'utils/constants';
import { sySpecificUsers } from '../../redux/features/shipyard/actions';
import UserModal from 'components/users/UserModal';
import AlertUserDelete from 'components/users/AlertDelete';
import _ from 'lodash';
import useAuth from 'hooks/useAuth';
import { getDepartment, getDepartments } from 'api/department';
import NoDataMessage from 'components/@extended/NoDataMessage';
import DropdownDependencyInfo from 'components/@extended/DropdownDependencyInfo';

export const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta(itemRank);

  return itemRank.passed;
};

function ReactTable({ data, columns, globalFilter, setGlobalFilter }) {
  const theme = useTheme();

  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    globalFilterFn: fuzzyFilter,
    debugTable: true
  });

  const backColor = alpha(theme.palette.primary.lighter, 0.1);
  let headers = [];
  columns.map(
    (columns) =>
      columns.accessorKey &&
      headers.push({
        label: typeof columns.header === 'string' ? columns.header : '#'
      })
  );

  return (
    <ScrollX>
      <Stack>
        <RowSelection selected={Object.keys(rowSelection).length} />
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableCell key={header.id} {...header.column.columnDef.meta}>
                        {header.isPlaceholder ? null : (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                          </Stack>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` } }}>
                      <TableCell colSpan={row.getVisibleCells().length}>
                        {/* <ExpandingUserDetail data={row.original} /> */}
                        <>Expanding Detail</>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <TablePagination
              {...{
                setPageSize: table.setPageSize,
                setPageIndex: table.setPageIndex,
                getState: table.getState,
                getPageCount: table.getPageCount
              }}
            />
          </Box>
        </>
      </Stack>
    </ScrollX>
  );
}

const ManageDeptUsers = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();

  const dispatch = useDispatch();
  const { shipyard, shipyardUsers: lists } = useSelector((state) => state.shipyard);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const [userModal, setUserModal] = useState(false);
  const [roleMap, setRoleMap] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteId, setDeleteId] = useState('');

  const userColsWithoutActions = userTableColumns('deptUsers');

  const handleClose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (!user) return;
    try {
      (async () => {
        if (user.role === 'FOREMAN') {
          const department = await getDepartment(user.department_id);
          setSelectedDepartment({ value: department.id, label: department.name });
        } else {
          const departments = await getDepartments(user.shipyard_id);
          setDepartments(departments);
        }

        setLoading(false);
      })();
    } catch (error) {
      console.error('Error occurred while getting departments', error);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !selectedDepartment?.value) return;

    dispatch(
      sySpecificUsers({ shipyard_id: user?.shipyard_id, query_params: `department_id=${selectedDepartment.value}&user_types=deptMembers` })
    );
  }, [selectedDepartment]);

  const columns = useMemo(
    () => [
      ...userColsWithoutActions,

      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUser(row.original);
                    setUserModal(true);
                  }}
                >
                  <EditOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                    setDeleteId(row.original.id);
                  }}
                >
                  <DeleteOutlined />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    [theme]
  );

  const modalToggler = () => {
    setUserModal(!userModal);
    setSelectedUser(null);
  };

  const renderInfoMessage = () => {
    if (_.isEmpty(selectedDepartment)) return <DropdownDependencyInfo visible={_.isEmpty(selectedDepartment)} requiredField="Department" />;
    if (!lists.length)
      return <NoDataMessage message="No data available for DEPARTMENTAL users. You can create new one from above button" />;
  };

  return (
    <>
      <Typography
        variant="h2"
        sx={{
          fontSize: {
            xs: 'h5.fontSize',
            md: 'h2.fontSize'
          }
        }}
      >
        Manage Departmental Users
      </Typography>
      {_.isEmpty(shipyard) ? (
        <></>
      ) : (
        <Grid container spacing={2} sx={{ marginTop: '16px', marginBottom: '8px' }}>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Shipyard Select */}
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="shipyard-select-label">Shipyard</InputLabel>
                <Select labelId="shipyard-select-label" id="shipyard-select" value={shipyard?.id || ''} label="Shipyard">
                  <MenuItem value={shipyard?.id}>{shipyard?.name}</MenuItem>
                </Select>
              </FormControl>

              {/* Department Autocomplete */}
              {user?.department_id ? (
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel id="department-select-label">Department</InputLabel>
                  <Select
                    labelId="department-select-label"
                    id="department-select"
                    value={selectedDepartment?.value || ''}
                    label="Department"
                  >
                    <MenuItem value={selectedDepartment?.value}>{selectedDepartment?.label}</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <Autocomplete
                  sx={{ width: 300 }}
                  options={departments.map(({ id, name }) => ({ label: name, value: id }))}
                  isOptionEqualToValue={(option, value) => option.value === value?.value}
                  getOptionLabel={(option) => option.label || ''}
                  onChange={(_, value) => setSelectedDepartment(value)}
                  renderInput={(params) => <TextField {...params} label="Select Department" />}
                />
              )}

              {user?.role !== 'FOREMAN' && !lists.some((user) => user.role.name === 'FOREMAN') && !_.isEmpty(selectedDepartment) && (
                <Button
                  variant="contained"
                  onClick={() => {
                    setRoleMap('ADMIN_FOREMAN');
                    setUserModal(true);
                  }}
                >
                  Add Foreman
                </Button>
              )}
              {(user?.role === 'FOREMAN' || (lists.some((user) => user.role.name === 'FOREMAN') && !_.isEmpty(selectedDepartment))) && (
                <Button
                  variant="contained"
                  onClick={() => {
                    setRoleMap('ADMIN_EMP');
                    setUserModal(true);
                  }}
                >
                  Add Employees
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      )}

      <MainCard content={false}>
        {lists?.length ? (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ padding: 2, ...(matchDownSM && { '& .MuiOutlinedInput-root, & .MuiFormControl-root': { width: '100%' } }) }}
          >
            <DebouncedInput
              value={globalFilter ?? ''}
              onFilterChange={(value) => setGlobalFilter(String(value))}
              placeholder={`Search ${lists.length} records...`}
            />
          </Stack>
        ) : (
          <></>
        )}

        {lists?.length ? (
          <ReactTable
            {...{
              data: lists,
              columns,
              globalFilter,
              setGlobalFilter
            }}
          />
        ) : (
          renderInfoMessage()
        )}
        {open && <AlertUserDelete id={deleteId} title={deleteId} open={open} handleClose={handleClose} />}
        {userModal && (
          <UserModal
            open={userModal}
            modalToggler={modalToggler}
            user={selectedUser}
            shipyard={{ value: shipyard?.id, label: shipyard?.name }}
            department={selectedDepartment}
            roleMap={roleMap}
          />
        )}
      </MainCard>
    </>
  );
};

export default ManageDeptUsers;
