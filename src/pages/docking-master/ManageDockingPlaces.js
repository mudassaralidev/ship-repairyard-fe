import React, { Fragment, useEffect, useMemo, useState } from "react";

// material-ui
import { alpha, useTheme } from "@mui/material/styles";
import {
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
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";

// third-party
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

// project imports
import ScrollX from "components/ScrollX";
import MainCard from "components/MainCard";
import IconButton from "components/@extended/IconButton";
import {
  DebouncedInput,
  RowSelection,
  TablePagination,
} from "components/third-party/react-table";
import Loader from "components/Loader";
import NoDataMessage from "components/@extended/NoDataMessage";
import DockingPlaceModal from "components/docking-places/DockingPlaceModal";
import DeleteDockingPlaceDialog from "components/docking-places/DeleteDockingPlaceDialog";

// assets
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

// redux
import { useDispatch, useSelector } from "react-redux";
import { fetchDockingPlaces } from "../../redux/features/docking-places/actions";
import {
  selectDockingPlaces,
  selectDockingPlacesLoading,
  selectDockingPlacesPagination,
} from "../../redux/features/docking-places/selectors";

// utils
import { placeColumns } from "utils/constants";
import useAuth from "hooks/useAuth";

/**
 * Fuzzy filter function for React Table global search
 */
export const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta(itemRank);
  return itemRank.passed;
};

/**
 * ReactTable Component
 * Reusable table component with sorting, filtering, and pagination
 */
function ReactTable({
  data,
  columns,
  globalFilter,
  setGlobalFilter,
  pagination,
  onPageChange,
  currentPage,
  pageSize,
}) {
  const theme = useTheme();
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      globalFilter,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex: currentPage - 1, pageSize })
          : updater;
      if (newState.pageIndex !== currentPage - 1) {
        onPageChange(newState.pageIndex + 1);
      }
      if (newState.pageSize !== pageSize) {
        onPageChange(newState.pageIndex + 1, newState.pageSize);
      }
    },
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    globalFilterFn: fuzzyFilter,
    pageCount: pagination?.totalPages || 0,
    manualPagination: true,
  });

  const backColor = alpha(theme.palette.primary.lighter, 0.1);

  return (
    <ScrollX>
      <Stack>
        <RowSelection selected={Object.keys(rowSelection).length} />
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      {...header.column.columnDef.meta}
                    >
                      {header.isPlaceholder ? null : (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </Box>
                        </Stack>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <Box sx={{ p: 2 }}>
          <TablePagination
            {...{
              setPageSize: table.setPageSize,
              setPageIndex: table.setPageIndex,
              getState: table.getState,
              getPageCount: table.getPageCount,
              apiPageSize: pagination?.pageSize,
            }}
          />
        </Box>
      </Stack>
    </ScrollX>
  );
}

/**
 * ManageDockingPlaces Page Component
 * Main page for managing docking places
 */
const ManageDockingPlaces = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  // Redux
  const dispatch = useDispatch();
  const dockingPlaces = useSelector(selectDockingPlaces);
  const loading = useSelector(selectDockingPlacesLoading);
  const pagination = useSelector(selectDockingPlacesPagination);

  // Auth
  const { user } = useAuth();
  const { shipyard } = useSelector((state) => state.shipyard);

  // Local states
  const [globalFilter, setGlobalFilter] = useState("");
  const [addEditModal, setAddEditModal] = useState(false);
  const [selectedDockingPlace, setSelectedDockingPlace] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  /**
   * Fetch docking places on mount and when pagination changes
   */
  useEffect(() => {
    if (!user?.shipyard_id) return;

    dispatch(fetchDockingPlaces(user.shipyard_id, currentPage, pageSize));
  }, [user?.shipyard_id, currentPage, pageSize, dispatch]);

  /**
   * Columns with actions
   */
  const columns = useMemo(
    () => [
      ...placeColumns,
      {
        header: "Actions",
        meta: {
          className: "cell-center",
        },
        disableSortBy: true,
        cell: ({ row }) => (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={0}
          >
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={() => {
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
                onClick={() => {
                  setSelectedDockingPlace(row.original);
                  setDeleteDialogOpen(true);
                }}
              >
                <DeleteOutlined />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [theme],
  );

  const handleModalToggle = () => {
    setAddEditModal(!addEditModal);
    setSelectedDockingPlace(null);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedDockingPlace(null);
  };

  const handlePageChange = (newPage, newPageSize) => {
    if (newPageSize !== undefined) {
      setPageSize(newPageSize);
    } else {
      setCurrentPage(newPage);
    }
  };

  if (loading && dockingPlaces.length === 0) {
    return <Loader />;
  }

  return (
    <Fragment>
      {/* Page Title */}
      <Typography
        variant="h2"
        sx={{
          fontSize: {
            xs: "h5.fontSize",
            md: "h2.fontSize",
          },
          mb: 2,
        }}
      >
        Manage Docking Places
      </Typography>

      {/* Shipyard Info */}
      {shipyard && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Shipyard: <strong>{shipyard.name}</strong>
            </Typography>
          </Grid>
        </Grid>
      )}

      {/* Main Content Card */}
      <MainCard content={false}>
        {/* Search and Actions Bar */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            padding: 2,
            ...(matchDownSM && {
              "& .MuiOutlinedInput-root, & .MuiFormControl-root": {
                width: "100%",
              },
            }),
          }}
        >
          <DebouncedInput
            value={globalFilter ?? ""}
            onFilterChange={(value) => setGlobalFilter(String(value))}
            placeholder={`Search ${pagination?.totalRecords || 0} records...`}
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={handleModalToggle}
              fullWidth={matchDownSM}
            >
              Create Docking Place
            </Button>
          </Stack>
        </Stack>

        {/* Table or Empty State */}
        {dockingPlaces.length === 0 ? (
          <NoDataMessage message="No docking places available. Create one using the button above." />
        ) : (
          <ReactTable
            data={dockingPlaces}
            columns={columns}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            pagination={pagination}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        )}
      </MainCard>

      {/* Create/Edit Modal */}
      <DockingPlaceModal
        open={addEditModal}
        modalToggler={handleModalToggle}
        dockingPlace={selectedDockingPlace}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDockingPlaceDialog
        open={deleteDialogOpen}
        dockingPlace={selectedDockingPlace}
        onClose={handleDeleteClose}
      />
    </Fragment>
  );
};

export default ManageDockingPlaces;
