import { Fragment, useEffect, useMemo, useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
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
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { userTableColumns } from 'utils/constants';
import { fetchShipyards, sySpecificUsers } from '../../redux/features/shipyard/actions';
import UserModal from 'components/users/UserModal';
import AlertUserDelete from 'components/users/AlertDelete';
import _ from 'lodash';
import DropdownDependencyInfo from 'components/@extended/DropdownDependencyInfo';
import NoDataMessage from 'components/@extended/NoDataMessage';

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

const UserListPage = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();
  const { shipyards, shipyardUsers: lists, status } = useSelector((state) => state.shipyard);

  const [open, setOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedShipyard, setSelectedShipyard] = useState([]);

  const [userModal, setUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteId, setDeleteId] = useState('');

  const userColsWithoutActions = userTableColumns('administratorUsers');

  const handleClose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    dispatch(fetchShipyards());
  }, []);

  useEffect(() => {
    if (!_.isEmpty(selectedShipyard)) {
      dispatch(sySpecificUsers({ shipyard_id: selectedShipyard.value }));
    }
  }, [selectedShipyard?.value]);

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
    setUserModal(true);
    setSelectedUser(null);
  };

  return (
    <>
      <Grid container direction="column" sx={{ marginBottom: '8px' }} spacing={2}>
        <Grid item>
          <Typography variant="h2">Manage Administrative Users</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            sx={{ width: 300 }}
            options={shipyards.map(({ id, name }) => ({ label: name, value: id }))}
            getOptionLabel={(option) => option.label || ''}
            onChange={(_, value) => {
              setSelectedShipyard(value);
            }}
            renderInput={(params) => <TextField {...params} label="Select Shipyard" />}
          />
        </Grid>
      </Grid>
      {_.isEmpty(selectedShipyard) ? (
        <DropdownDependencyInfo visible={_.isEmpty(selectedShipyard)} requiredField="Shipyard" />
      ) : (
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

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={modalToggler}>
                  Create User
                </Button>
              </Stack>
            </Stack>
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
            <NoDataMessage message="ADMIN users data does not exist for this shipyard. You can create new one from above button" />
          )}
          {open && <AlertUserDelete id={deleteId} title={deleteId} open={open} handleClose={handleClose} />}
          {userModal && <UserModal open={userModal} modalToggler={setUserModal} user={selectedUser} shipyard={selectedShipyard} />}
        </MainCard>
      )}
    </>
  );
};

export default UserListPage;
