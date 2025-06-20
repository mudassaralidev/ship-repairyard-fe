import { Fragment, useMemo, useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  useMediaQuery,
  Chip
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
import { workOrderColumns } from 'utils/constants';
import _ from 'lodash';
import Loader from 'components/Loader';
import WorkOrderModal from './WorkOrderModal';
import UpdateStatusModal from './UpdateStatusModal';
import AssignUpdateEmployeesModal from './AssignEmployeesModal';
import NoDataMessage from 'components/@extended/NoDataMessage';
import EmployeesModal from './EmployeesModal';

const getStatusChipProps = (status) => {
  const normalized = status?.toUpperCase?.() ?? '';

  const statusMap = {
    UPDATE: { color: 'primary', label: 'Update' },
    STARTED: { color: 'info', label: 'STARTED' },
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

const WorkOrderTable = ({ lists = [], repair = {}, departments = [], showPagination = true, showCreateBtn = true }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [workOrderModal, setWorkOrderModal] = useState(false);

  const [open, setOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const [assignEmpModal, setAssignEmpModal] = useState(false);
  const [employeesModal, setEmployeesModal] = useState(false);

  const colsWithoutActions = workOrderColumns;

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(
    () => [
      ...colsWithoutActions,
      {
        header: 'Status',
        cell: ({ row }) => (
          <Tooltip title="Update Status" arrow>
            <Button
              variant="text"
              size="small"
              sx={{
                textTransform: 'capitalize',
                cursor: 'pointer',
                minWidth: '100px'
              }}
              onClick={() => {
                setSelectedWorkOrder(row.original);
                setUpdateStatusModal(true);
              }}
            >
              <Chip {...getStatusChipProps(row.original.status || 'Update')} />
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
          return row.original.status !== 'COMPLETED' ? (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedWorkOrder(row.original);
                    setWorkOrderModal(true);
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
              <Button
                onClick={() => {
                  setSelectedWorkOrder(row.original);
                  setAssignEmpModal(true);
                }}
              >
                Assign
              </Button>
            </Stack>
          ) : (
            <Tooltip title="View Employees" arrow>
              <Button
                variant="text"
                size="small"
                sx={{
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  minWidth: '100px'
                }}
                onClick={() => {
                  setSelectedWorkOrder(row.original);
                  setEmployeesModal(true);
                }}
              >
                <Chip label="View Employees" />
              </Button>
            </Tooltip>
          );
        }
      }
    ],
    [theme]
  );

  const modalToggler = () => {
    setWorkOrderModal(!workOrderModal);
    setSelectedWorkOrder(null);
  };

  if (false) return <Loader />;

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
              placeholder={`Search ${lists?.length} records...`}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={modalToggler}>
                  Create Work Order
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
          <NoDataMessage message="There are no current work orders on selected repair. You can create one using the button above." />
        )}

        {workOrderModal && (
          <WorkOrderModal
            open={workOrderModal}
            modalToggler={() => {
              setSelectedWorkOrder(null);
              setWorkOrderModal(false);
            }}
            repair={repair}
            departments={departments}
            workOrder={selectedWorkOrder}
            type={'Work Order'}
          />
        )}

        {updateStatusModal && (
          <UpdateStatusModal
            open={updateStatusModal}
            modalToggler={() => {
              setSelectedWorkOrder(null);
              setUpdateStatusModal(!updateStatusModal);
            }}
            workOrder={selectedWorkOrder}
          />
        )}

        {assignEmpModal && (
          <AssignUpdateEmployeesModal
            open={assignEmpModal}
            modalToggler={() => {
              setSelectedWorkOrder(null);
              setAssignEmpModal(!assignEmpModal);
            }}
            workOrder={{ ...selectedWorkOrder }}
          />
        )}

        {employeesModal && (
          <EmployeesModal
            open={employeesModal}
            employees={selectedWorkOrder.employees}
            modalToggler={() => {
              setSelectedWorkOrder({});
              setEmployeesModal(false);
            }}
            departmentName={selectedWorkOrder.foreman.department.name}
          />
        )}
      </MainCard>
    </>
  );
};

export default WorkOrderTable;
