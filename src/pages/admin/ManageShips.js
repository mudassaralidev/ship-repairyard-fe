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
import { shipColumns } from 'utils/constants';
import { fetchShipyard } from '../../redux/features/shipyard/actions';
import AlertUserDelete from 'components/users/AlertDelete';
import _ from 'lodash';
import useAuth from 'hooks/useAuth';
import { fetchShips } from '../../redux/features/ships/actions';
import { fetchClients } from 'api/client';
import { toast } from 'react-toastify';
import AddSuperintendentModal from 'components/ships/AddSuperIntendentToShipModal';
import AddEditShipModal from 'components/ships/AddEditShipModal';

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

const ManageShips = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();

  const dispatch = useDispatch();
  const {
    shipyard: { shipyard, status },
    ship: { ships: lists = [], status: shipStatus } = {}
  } = useSelector((state) => state);
  const [selectedShip, setSelectedShip] = useState({});
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const [addEditModal, setAddEditModal] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const handleClose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (!user) return;
    try {
      (async () => {
        dispatch(fetchShipyard(user.shipyard_id));
        dispatch(fetchShips(user.shipyard_id));
        const clientsData = await fetchClients(user.shipyard_id);
        setClients(clientsData);

        setLoading(false);
      })();
    } catch (error) {
      console.error('Error occurred while getting departments', error);
      toast.error('Some error occurred, please try again later');
    }
  }, [user]);

  const columns = useMemo(
    () => [
      ...shipColumns,
      {
        header: 'Superintendent Name',
        cell: ({ row }) => {
          return (
            <Stack direction="column" alignItems="center" justifyContent="center" spacing={0}>
              <Typography>{row.original?.superintendent?.name}</Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setSelectedShip(row.original);
                  setUserModal(true);
                }}
              >
                {!row.original?.superintendent?.name ? 'Add Superintendent' : 'Update'}
              </Button>
            </Stack>
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
                    setSelectedShip(row.original);
                    setAddEditModal(true);
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
                    setSelectedShip(row.original);
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
    setAddEditModal(!addEditModal);
    setSelectedShip(null);
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
        Manage Ships
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

              <Autocomplete
                sx={{ width: 300 }}
                options={clients.map(({ id, name }) => ({ label: name, value: id }))}
                isOptionEqualToValue={(option, value) => option.value === value?.value}
                getOptionLabel={(option) => option.label || ''}
                onChange={(_, value) => {
                  setGlobalFilter(value?.label || '');
                }}
                renderInput={(params) => <TextField {...params} label="Select Client" />}
                disabled={!lists.length}
              />
            </Stack>
          </Grid>
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
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button variant="contained" startIcon={<PlusOutlined />} onClick={modalToggler}>
                Create Ship
              </Button>
            </Stack>
          </Stack>
        </Stack>

        {status === 'loading' || shipStatus === 'loading' || loading || lists?.length ? (
          <ReactTable
            {...{
              data: lists.map((ship, idx) => ({ idx: idx + 1, ...ship })),
              columns,
              globalFilter,
              setGlobalFilter
            }}
          />
        ) : (
          <EmptyReactTable columns={shipColumns} />
        )}
        {open && <AlertUserDelete id={deleteId} title={deleteId} open={open} handleClose={handleClose} />}
        {addEditModal && (
          <AddEditShipModal open={addEditModal} modalToggler={modalToggler} shipyard={shipyard} clients={clients} ship={selectedShip} />
        )}
        {userModal && (
          <AddSuperintendentModal
            open={userModal}
            modalToggler={() => {
              setUserModal(false);
            }}
            shipyard={shipyard}
            ship={selectedShip}
          />
        )}
      </MainCard>
    </>
  );
};

export default ManageShips;
