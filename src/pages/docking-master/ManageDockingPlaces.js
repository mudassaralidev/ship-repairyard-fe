import { Fragment, useEffect, useMemo, useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
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
import { fetchShipyard } from '../../redux/features/shipyard/actions';
import { placeColumns } from 'utils/constants';
import useAuth from 'hooks/useAuth';
import { deleteDockingPlace, getDockingPlaces } from 'api/dockingPlaces';
import DockingPlaceModal from 'components/docking-places/DockingPlaceModal';

const avatarImage = require.context('assets/images/users', true);

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

const ManageDockingPlaces = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();
  const { shipyard } = useSelector((state) => state.shipyard);
  const { user } = useAuth();
  const [dockingPlaces, setDockingPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const [addEditModal, setAddEditModal] = useState(false);
  const [selectedDockingPlace, setSelectedDockingPlace] = useState(null);

  const handleClose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (!user) return;
    try {
      (async () => {
        dispatch(fetchShipyard(user.shipyard_id));
        const places = await getDockingPlaces(user.shipyard_id);
        setDockingPlaces(places.map((place, idx) => ({ idx: idx + 1, ...place })));
      })();
    } catch (error) {
      console.error('Error occurred while getting departments', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const columns = useMemo(
    () => [
      ...placeColumns,
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
                    setSelectedDockingPlace(row.original);
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
                    setSelectedDockingPlace(row.original);
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
    setAddEditModal(true);
    setSelectedDockingPlace(null);
  };

  return (
    <Fragment>
      <Typography
        variant="h2"
        sx={{
          fontSize: {
            xs: 'h5.fontSize',
            md: 'h2.fontSize'
          }
        }}
      >
        Manage Docking Places
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
            placeholder={`Search ${dockingPlaces.length} records...`}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button variant="contained" startIcon={<PlusOutlined />} onClick={modalToggler}>
                Create Place
              </Button>
            </Stack>
          </Stack>
        </Stack>

        {loading || !dockingPlaces.length ? (
          <EmptyReactTable columns={placeColumns} />
        ) : (
          <ReactTable
            {...{
              data: dockingPlaces,
              columns,
              globalFilter,
              setGlobalFilter
            }}
          />
        )}
        {open && (
          <AlertDeleteRecord
            data={selectedDockingPlace}
            open={open}
            handleClose={handleClose}
            handleDelete={async () => {
              await deleteDockingPlace(selectedDockingPlace.id);
            }}
          />
        )}
        {addEditModal && (
          <DockingPlaceModal
            open={addEditModal}
            modalToggler={() => setAddEditModal(false)}
            place={selectedDockingPlace}
            handleUpdatePlaceState={(place) => {
              if (!selectedDockingPlace) {
                setDockingPlaces((preState = []) => {
                  return [place, ...preState].map((plc, idx) => ({ ...plc, idx: idx + 1 }));
                });
              } else {
                setDockingPlaces((preState) => preState.map((plc) => (plc.id === place.id ? place : plc)));
              }
            }}
          />
        )}
      </MainCard>
    </Fragment>
  );
};

export default ManageDockingPlaces;
