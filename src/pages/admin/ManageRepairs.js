import { Fragment, useEffect, useMemo, useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Chip,
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
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { repairColumns } from 'utils/constants';
import _ from 'lodash';
import useAuth from 'hooks/useAuth';
import Loader from 'components/Loader';
import { fetchRepairs } from '../../redux/features/repair/actions';
import RepairModal from 'components/repair/RepairModal';
import { getDockingNamesForRepair } from 'api/docking';
import UpdateStatusModal from 'components/repair/UpdateStatusModal';
import ExpandingRepairHistory from 'components/repair/RepairHistory';
import WorkOrderModal from 'components/work-order/WorkOrderModal';
import dataApi from 'utils/dataApi';
import { toast } from 'react-toastify';
import { fetchInventoriesApi } from 'api/shipyard';

const getStatusChipProps = (status) => {
  const normalized = status?.toUpperCase?.() ?? '';

  const statusMap = {
    INITIATED: { color: 'secondary', label: 'INITIATED' },
    APPROVED: { color: 'info', label: 'APPROVED' },
    BLOCKED: { color: 'error', label: 'BLOCKED' },
    COMPLETED: { color: 'success', label: 'COMPLETED' }
  };

  return {
    ...(statusMap[normalized] || { color: 'default', label: normalized }),
    size: 'medium',
    variant: 'dark'
  };
};

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
                      <TableCell colSpan={row.getVisibleCells().length}>
                        {/* <ExpandingUserDetail data={row.original} /> */}
                        <ExpandingRepairHistory repairId={row.original.id} />
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

const ManageRepairs = ({ repairData, departsData = [], inventoryData = [], dockedName }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();

  const dispatch = useDispatch();
  const { shipyard } = useSelector((state) => state.shipyard);
  const { repairs: lists, status: fetchingRepairs } = useSelector((state) => state.repair);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [repairModal, setRepairModal] = useState(false);
  const [dockingNames, setDockingNames] = useState(dockedName ? [dockedName] : []);
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const [workOrderModal, setWOModal] = useState(false);
  const [departments, setDepartments] = useState(departsData);
  const [inventories, setInventories] = useState(inventoryData);

  const [open, setOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const repairColsWithoutActions = repairColumns;

  const handleClose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (!user || repairData) return;

    (async () => {
      try {
        const { shipyard_id } = user;

        dispatch(fetchRepairs(shipyard_id));
        const [data, { data: departsData }, inventories] = await Promise.all([
          getDockingNamesForRepair(shipyard_id),
          dataApi.get('/v1/departments?include_foreman=true'),
          fetchInventoriesApi(shipyard_id)
        ]);
        setDepartments(departsData.departments);
        setDockingNames(data);
        setInventories(inventories);
      } catch (error) {
        console.error('Error occurred while getting repairs', error);
        toast.error(error?.response?.data?.message || 'Some error occurred while getting data for repair');
      }
    })();
  }, [user]);

  const columns = useMemo(
    () => [
      ...repairColsWithoutActions,
      {
        header: 'Order Type',
        id: 'order_type',
        cell: ({ row }) => {
          const { requires_work_order, requires_subcontractor, status } = row.original;
          if (requires_work_order && status === 'APPROVED')
            return (
              <Stack direction="row" gap={1}>
                <Typography>Work Order</Typography>
                <Button
                  sx={{ padding: '0px', justifyContent: 'end', minWidth: '30px' }}
                  variant="outlined"
                  startIcon={<PlusOutlined />}
                  onClick={() => {
                    setWOModal(true);
                    setSelectedRepair(row.original);
                  }}
                ></Button>
              </Stack>
            );
          if (requires_work_order) return 'Work Order';
          if (requires_subcontractor) return 'Subcontractor Order';
          return '-';
        }
      },

      {
        header: 'Status',
        cell: ({ row }) => (
          <Tooltip title="Update Status" arrow>
            <Button
              variant="text"
              size="small"
              sx={{
                textTransform: 'capitalize', // Makes ENUM values like "APPROVED" more readable
                cursor: 'pointer',
                minWidth: '100px'
              }}
              onClick={() => {
                setSelectedRepair(row.original);
                setUpdateStatusModal(true);
              }}
            >
              <Chip {...getStatusChipProps(row.original.status)} />
            </Button>
          </Tooltip>
        )
      },

      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          const collapseIcon =
            row.getCanExpand() && row.getIsExpanded() ? (
              <PlusOutlined style={{ color: 'rgb(255, 77, 79)', transform: 'rotate(45deg)' }} />
            ) : (
              <EyeOutlined />
            );
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="Repair History">
                <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                  {collapseIcon}
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRepair(row.original);
                    setRepairModal(true);
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
    setRepairModal(!repairModal);
    setSelectedRepair(null);
  };

  if ([fetchingRepairs].includes('loading')) return <Loader />;

  return (
    <>
      {!repairData && (
        <Typography
          variant="h2"
          sx={{
            fontSize: {
              xs: 'h5.fontSize',
              md: 'h2.fontSize'
            }
          }}
        >
          Manage Repairs
        </Typography>
      )}

      {_.isEmpty(shipyard) || repairData ? (
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
            </Stack>
          </Grid>
        </Grid>
      )}

      <MainCard content={false}>
        {!repairData && (
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
                  Create Repair
                </Button>
              </Stack>
            </Stack>
          </Stack>
        )}

        {lists?.length || repairData ? (
          <ReactTable
            {...{
              data: repairData ? [repairData] : lists,
              columns,
              globalFilter,
              setGlobalFilter,
              repairId: selectedRepair?.id,
              showPagination: !repairData
            }}
          />
        ) : (
          <EmptyReactTable columns={repairColsWithoutActions} />
        )}

        {repairModal && (
          <RepairModal
            open={repairModal}
            modalToggler={modalToggler}
            shipyard={shipyard}
            repair={selectedRepair}
            dockingNames={dockingNames}
          />
        )}
        {updateStatusModal && (
          <UpdateStatusModal
            open={updateStatusModal}
            modalToggler={() => {
              setSelectedRepair(null);
              setUpdateStatusModal(!updateStatusModal);
            }}
            repair={selectedRepair}
          />
        )}

        {workOrderModal && (
          <WorkOrderModal
            open={workOrderModal}
            modalToggler={() => {
              setSelectedRepair(null);
              setWOModal(false);
            }}
            repair={selectedRepair}
            departments={departments}
            inventories={inventories}
          />
        )}
      </MainCard>
    </>
  );
};

export default ManageRepairs;
