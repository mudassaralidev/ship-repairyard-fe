import { Fragment, useMemo, useState } from 'react';

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
import { inventoryOrderColumns, workOrderColumns } from 'utils/constants';
import _ from 'lodash';
import Loader from 'components/Loader';

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
    globalFilterFn: fuzzyFilter
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
                      <TableCell colSpan={row.getVisibleCells().length}></TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {showPagination && (
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
        )}
      </Stack>
    </ScrollX>
  );
}

const InventoryOrderTable = ({ lists = [], hideSYName = false, showTitle = true, showPagination = true }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();
  const { shipyard } = useSelector((state) => state.shipyard);
  const [selectedInventoryOrder, setSelectedInventoryOrder] = useState(null);
  const [inventoryOrderModal, setInventoryOrderModal] = useState(false);

  const [open, setOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const colsWithoutActions = inventoryOrderColumns; // import this from your constants

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(
    () => [
      ...colsWithoutActions,
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
                    setSelectedInventoryOrder(row.original);
                    setInventoryOrderModal(true);
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
    setInventoryOrderModal(!inventoryOrderModal);
    setSelectedInventoryOrder(null);
  };

  if (false) return <Loader />;

  return (
    <>
      {showTitle && (
        <Typography
          variant="h2"
          sx={{
            fontSize: {
              xs: 'h5.fontSize',
              md: 'h2.fontSize'
            }
          }}
        >
          Manage Inventory Orders
        </Typography>
      )}

      {_.isEmpty(shipyard) || hideSYName ? null : (
        <Grid container spacing={2} sx={{ marginTop: '16px', marginBottom: '8px' }}>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="shipyard-select-label">Shipyard</InputLabel>
                <Select labelId="shipyard-select-label" id="shipyard-select" value={shipyard?.id || ''} label="Shipyard">
                  <MenuItem value={shipyard?.id}>{shipyard?.name}</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>
      )}

      <MainCard content={false}>
        {lists.length > 1 && (
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
              placeholder={`Search ${lists?.length} records...`}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={modalToggler}>
                  Create Inventory Order
                </Button>
              </Stack>
            </Stack>
          </Stack>
        )}

        {lists?.length ? (
          <ReactTable
            {...{
              data: lists,
              columns,
              globalFilter,
              setGlobalFilter,
              showPagination
            }}
          />
        ) : (
          <EmptyReactTable columns={colsWithoutActions} />
        )}

        {/* {inventoryOrderModal && (
            <InventoryOrderModal
              open={inventoryOrderModal}
              modalToggler={modalToggler}
              shipyard={shipyard}
              inventoryOrder={selectedInventoryOrder}
            />
          )} */}
      </MainCard>
    </>
  );
};

export default InventoryOrderTable;
