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
import EmptyReactTable from 'components/react-table/empty';

import { DebouncedInput, RowSelection, TablePagination } from 'components/third-party/react-table';

// assets
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { userTableColumns } from 'utils/constants';
import { fetchShipyard, fetchShipyards, sySpecificUsers } from '../../redux/features/shipyard/actions';
import UserModal from 'components/users/UserModal';
import AlertUserDelete from 'components/users/AlertDelete';
import _ from 'lodash';
import useAuth from 'hooks/useAuth';
import ClientAssignmentModal from 'components/users/ClientAssignmentModal';

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

const ManageClientUser = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();

  const dispatch = useDispatch();
  const { shipyard, shipyardUsers: lists, status } = useSelector((state) => state.shipyard);

  const [open, setOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const [userModal, setUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteId, setDeleteId] = useState('');
  const [activeBtn, setActiveBtn] = useState('');
  const [assignClientModal, setAssignClientModal] = useState(false);
  const [roleMap, setRoleMap] = useState('');

  const userColsWithoutActions = userTableColumns('clientUsers');

  const handleClose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (user) {
      setRoleMap(() => {
        if (user.role === 'ADMIN') {
          return 'ADMIN_CLIENT';
        } else if (user.role === 'CALCULATOR_ENGINEER') {
          return 'CALC_CLINET';
        } else {
          return '';
        }
      });
      dispatch(fetchShipyard(user?.shipyard_id));
      dispatch(sySpecificUsers({ shipyard_id: user?.shipyard_id, query_params: 'user_types=clients' }));
    }
  }, [user]);

  const columns = useMemo(
    () => [
      ...userColsWithoutActions,
      ...(user?.role === 'ADMIN'
        ? [
            {
              header: 'Assign Company',
              disableSortBy: true,
              cell: ({ row }) => {
                return row.original?.role?.name === 'SUPERINTENDENT' ? (
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setAssignClientModal(true);
                      setSelectedUser(row.original);
                    }}
                  >
                    {!row.original.client?.name ? 'Assign' : 'Update'}
                  </Button>
                ) : (
                  <></>
                );
              }
            },
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
          ]
        : [])
    ],
    [theme]
  );

  const modalToggler = () => {
    setUserModal(!userModal);
    setSelectedUser(null);
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
        Manage Client Users
      </Typography>
      {_.isEmpty(shipyard) ? (
        <></>
      ) : (
        <Grid container spacing={2} sx={{ marginTop: '16px', marginBottom: '8px' }}>
          <Grid item xs={12} md={6} lg={2}>
            <FormControl>
              <InputLabel id="demo-simple-select-helper-label">Shipyard</InputLabel>
              <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" value={shipyard?.id} label="Shipyard">
                <MenuItem value={shipyard?.id}>{shipyard?.name}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {user?.role === 'ADMIN' && (
            <Grid item xs={12} md={6}>
              <Stack direction="row" gap={2}>
                <Button
                  variant={activeBtn === 'client' ? 'contained' : 'outlined'}
                  onClick={() => {
                    if (activeBtn === 'client') {
                      setActiveBtn('');
                      setGlobalFilter('');
                      return;
                    }
                    setActiveBtn('client');
                    setGlobalFilter('CLIENT');
                  }}
                >
                  Clients
                </Button>
                <Button
                  variant={activeBtn === 'superintendent' ? 'contained' : 'outlined'}
                  onClick={() => {
                    if (activeBtn === 'superintendent') {
                      setActiveBtn('');
                      setGlobalFilter('');
                      return;
                    }
                    setActiveBtn('superintendent');
                    setGlobalFilter('SUPERINTENDENT');
                  }}
                >
                  Superintendents
                </Button>
              </Stack>
            </Grid>
          )}
        </Grid>
      )}

      <MainCard content={false}>
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

          {user?.role === 'ADMIN' && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={modalToggler}>
                  Create User
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>

        {status !== 'loading' || lists?.length ? (
          <ReactTable
            {...{
              data: lists,
              columns,
              globalFilter,
              setGlobalFilter
            }}
          />
        ) : (
          <EmptyReactTable columns={userColsWithoutActions} />
        )}
        {open && <AlertUserDelete id={deleteId} title={deleteId} open={open} handleClose={handleClose} />}
        {userModal && (
          <UserModal
            open={userModal}
            modalToggler={modalToggler}
            user={selectedUser}
            shipyard={{ value: shipyard?.id, label: shipyard?.name }}
            roleMap={roleMap}
          />
        )}
        {assignClientModal && (
          <ClientAssignmentModal
            open={assignClientModal}
            modalToggler={setAssignClientModal}
            shipyard_id={shipyard.id}
            user={selectedUser}
          />
        )}
      </MainCard>
    </>
  );
};

export default ManageClientUser;
