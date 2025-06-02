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
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { shipColumns } from 'utils/constants';
import AlertUserDelete from 'components/users/AlertDelete';
import _ from 'lodash';
import useAuth from 'hooks/useAuth';
import { fetchShips } from '../../redux/features/ships/actions';
import { fetchClients } from 'api/client';
import { toast } from 'react-toastify';
import AddEditShipModal from 'components/ships/AddEditShipModal';
import DockingModal from 'components/docking/DokcingModal';
import { getAvailableDockingPlaces } from 'api/dockingPlaces';

export const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta(itemRank);

  return itemRank.passed;
};

function ReactTable({ data, columns, globalFilter, setGlobalFilter, showPagination }) {
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
        {showPagination ? (
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
        ) : (
          <></>
        )}
      </Stack>
    </ScrollX>
  );
}

const ManageShips = ({ showCreateBtn = true, shipData, dockedPlaces = [] }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();

  const dispatch = useDispatch();
  const {
    shipyard: { shipyard, status },
    ship: { ships: lists = [], status: shipStatus } = {},
    docking: { successMessage } = {}
  } = useSelector((state) => state);
  const [selectedShip, setSelectedShip] = useState({});
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const [addEditModal, setAddEditModal] = useState(false);
  const [addDockModal, setAddDockModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [dockingPlaces, setDockingPlaces] = useState(dockedPlaces);

  const handleClose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (!user || shipData) return;
    (async () => {
      try {
        dispatch(fetchShips(user.shipyard_id));
        const [clientsData, dockingData] = await Promise.all([
          fetchClients(user.shipyard_id),
          getAvailableDockingPlaces(user?.shipyard_id)
        ]);
        setClients(clientsData);
        setDockingPlaces(dockingData);

        setLoading(false);
      } catch (error) {
        toast.error(error.response.data.error.message || error.response.data.message || 'Some error occurred, please try again later');
        console.error('Error occurred while getting departments', error);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!successMessage) return;

    dispatch(fetchShips(user.shipyard_id));
  }, [successMessage]);

  useEffect(() => {
    if (!shipData) return;
    try {
      (async () => {
        const clientsData = fetchClients(user.shipyard_id);
        setClients(clientsData);

        setLoading(false);
      })();
    } catch (error) {
      console.error('Error occurred while getting dockings', error);
      toast.error('Some error occurred, please try again later');
    }
  }, [shipData?.id]);

  const columns = useMemo(
    () => [
      ...shipColumns,

      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              {row.original?.dockings ? (
                !row.original?.dockings?.length
              ) : row.original.docking_count < 1 ? (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    setSelectedShip(row.original);
                    setAddDockModal(true);
                  }}
                >
                  Dock
                </Button>
              ) : (
                <></>
              )}
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
      <MainCard content={false}>
        {showCreateBtn && (
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
        )}

        {status === 'loading' || shipStatus === 'loading' || loading ? (
          <EmptyReactTable columns={shipColumns} />
        ) : (
          <ReactTable
            {...{
              data: shipData ? [shipData] : lists,
              columns,
              globalFilter,
              setGlobalFilter,
              showPagination: !shipData
            }}
          />
        )}
        {open && <AlertUserDelete id={deleteId} title={deleteId} open={open} handleClose={handleClose} />}
        {addEditModal && (
          <AddEditShipModal open={addEditModal} modalToggler={modalToggler} shipyard={shipyard} clients={clients} ship={selectedShip} />
        )}

        {addDockModal && (
          <DockingModal
            open={addDockModal}
            modalToggler={() => {
              setAddDockModal(false);
            }}
            shipyard={shipyard}
            dockingShip={selectedShip}
            dockingPlaces={dockingPlaces}
            removeUsedPlace={(placeId) => setDockingPlaces((preState) => preState.filter((p) => p.id !== placeId))}
          />
        )}
      </MainCard>
    </>
  );
};

export default ManageShips;
