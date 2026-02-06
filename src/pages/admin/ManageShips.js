import { Fragment, useEffect, useMemo, useState } from "react";

// material-ui
import { alpha, useTheme } from "@mui/material/styles";
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
  TextField,
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

// project-import
import ScrollX from "components/ScrollX";
import MainCard from "components/MainCard";
import IconButton from "components/@extended/IconButton";

import {
  DebouncedInput,
  RowSelection,
  TablePagination,
} from "components/third-party/react-table";

// assets
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { shipColumns } from "utils/constants";
import AlertUserDelete from "components/users/AlertDelete";
import _ from "lodash";
import useAuth from "hooks/useAuth";
import { fetchShips } from "../../redux/features/ships/actions";
import { toast } from "react-toastify";
import AddEditShipModal from "components/ships/AddEditShipModal";
import DockingModal from "components/docking/DokcingModal";
import NoDataMessage from "components/@extended/NoDataMessage";
import { resetPagination } from "../../redux/features/ships/slice";
import BulkShipImportModal from "components/ships/BulkShipImportModal";

export const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta(itemRank);

  return itemRank.passed;
};

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
  let headers = [];
  columns.map(
    (columns) =>
      columns.accessorKey &&
      headers.push({
        label: typeof columns.header === "string" ? columns.header : "#",
      }),
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
                      <TableCell
                        key={header.id}
                        {...header.column.columnDef.meta}
                      >
                        {header.isPlaceholder ? null : (
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Box>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </Box>
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow
                      sx={{
                        bgcolor: backColor,
                        "&:hover": { bgcolor: `${backColor} !important` },
                      }}
                    >
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
                getPageCount: table.getPageCount,
                apiPageSize: pagination?.pageSize,
              }}
            />
          </Box>
        </>
      </Stack>
    </ScrollX>
  );
}

const ManageShips = ({
  showCreateBtn = true,
  shipData,
  showTitle = true,
  showShipyardName = true,
  showActions = true,
}) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

  const dispatch = useDispatch();
  const {
    shipyard: { shipyard },
    ship: { ships: lists = [], status: shipStatus, pagination } = {},
  } = useSelector((state) => state);
  const [selectedShip, setSelectedShip] = useState({});

  const [open, setOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  const [addEditModal, setAddEditModal] = useState(false);
  const [addDockModal, setAddDockModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [fileModalOpen, setFileModalOpen] = useState(false);

  const handleClose = () => {
    setOpen(!open);
  };

  const handlePageChange = (newPage, newPageSize) => {
    if (newPageSize !== undefined) {
      setPageSize(newPageSize);
    } else {
      setCurrentPage(newPage);
    }
  };

  const columns = useMemo(
    () => [
      ...shipColumns,

      ...(showActions
        ? [
            {
              header: "Actions",
              meta: {
                className: "cell-center",
              },
              disableSortBy: true,
              cell: ({ row }) => {
                console.log();
                return (
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={0}
                  >
                    {row.original?.dockings ? (
                      !row.original?.dockings?.length
                    ) : !row.original.docking_count ||
                      row.original.docking_count < 1 ? (
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
              },
            },
          ]
        : []),
    ],
    [theme],
  );

  const modalToggler = () => {
    setAddEditModal(!addEditModal);
    setSelectedShip(null);
  };

  useEffect(() => {
    //getting data for listing page
    if (user && !shipData) {
      (async () => {
        try {
          dispatch(
            fetchShips({
              shipyardID: user.shipyard_id,
              queryParams: {
                page: currentPage,
                page_size: pageSize,
              },
            }),
          );
        } catch (error) {
          toast.error(
            error.response.data.error.message ||
              error.response.data.message ||
              "Some error occurred, please try again later",
          );
          console.error("Error occurred while getting departments", error);
        }
      })();
    }
  }, [user, shipData?.id, currentPage]);

  useEffect((_) => (_) => dispatch(resetPagination()), [dispatch]);

  return (
    <>
      {showTitle && (
        <Typography
          variant="h2"
          sx={{
            fontSize: {
              xs: "h5.fontSize",
              md: "h2.fontSize",
            },
          }}
        >
          Manage Ships
        </Typography>
      )}
      {_.isEmpty(shipyard) || !showShipyardName ? (
        <></>
      ) : (
        <Grid
          container
          spacing={2}
          sx={{ marginTop: "16px", marginBottom: "8px" }}
        >
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Shipyard Select */}
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="shipyard-select-label">Shipyard</InputLabel>
                <Select
                  labelId="shipyard-select-label"
                  id="shipyard-select"
                  value={shipyard?.id || ""}
                  label="Shipyard"
                >
                  <MenuItem value={shipyard?.id}>{shipyard?.name}</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<PlusOutlined />}
                onClick={(_) => setFileModalOpen(true)}
              >
                Import Ships
              </Button>
            </Stack>
          </Grid>
        </Grid>
      )}
      <MainCard content={false}>
        {showCreateBtn && (
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
              placeholder={`Search ${lists.length} records...`}
            />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  startIcon={<PlusOutlined />}
                  onClick={modalToggler}
                >
                  Create Ship
                </Button>
              </Stack>
            </Stack>
          </Stack>
        )}

        {shipStatus === "loading" || (!shipData && !lists.length) ? (
          <NoDataMessage message="There is no SHIP data available. You can create new one from above button" />
        ) : (
          <ReactTable
            {...{
              data: shipData ? [shipData] : lists,
              columns,
              globalFilter,
              setGlobalFilter,
              pagination,
              onPageChange: handlePageChange,
              currentPage,
              pageSize,
            }}
          />
        )}
        {open && (
          <AlertUserDelete
            id={deleteId}
            title={deleteId}
            open={open}
            handleClose={handleClose}
          />
        )}
        {addEditModal && (
          <AddEditShipModal
            open={addEditModal}
            modalToggler={modalToggler}
            shipyard={shipyard}
            ship={selectedShip}
          />
        )}

        {addDockModal && (
          <DockingModal
            open={addDockModal}
            modalToggler={() => {
              setAddDockModal(false);
            }}
            shipyard={shipyard}
            ship={selectedShip}
          />
        )}
        {fileModalOpen && (
          <BulkShipImportModal
            open={fileModalOpen}
            modalToggler={(_) => setFileModalOpen(!fileModalOpen)}
          />
        )}
      </MainCard>
    </>
  );
};

export default ManageShips;
