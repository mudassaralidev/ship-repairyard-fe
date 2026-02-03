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
import EmptyReactTable from "components/react-table/empty";

import {
  DebouncedInput,
  RowSelection,
  TablePagination,
} from "components/third-party/react-table";

// assets
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { inventoryColumns } from "utils/constants";
import _ from "lodash";
import useAuth from "hooks/useAuth";
import Loader from "components/Loader";
import { fetchInventories } from "../../redux/features/inventory/actions";
import InventoryModal from "components/inventory/InventoryModal";
import { resetPagination } from "../../redux/features/inventory/slice";

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

const ManageInventory = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

  const dispatch = useDispatch();
  const { shipyard } = useSelector((state) => state.shipyard);
  const {
    inventories: lists,
    status,
    pagination,
  } = useSelector((state) => state.inventory);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [inventoryModal, setInventoryModal] = useState(false);

  const [open, setOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  const colsWithoutActions = inventoryColumns;

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

  const modalToggler = () => {
    setInventoryModal(!inventoryModal);
    setSelectedInventory(null);
  };

  const columns = useMemo(
    () => [
      ...colsWithoutActions,
      {
        header: "Actions",
        meta: {
          className: "cell-center",
        },
        disableSortBy: true,
        cell: ({ row }) => {
          return (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={0}
            >
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInventory(row.original);
                    setInventoryModal(true);
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
        },
      },
    ],
    [theme],
  );

  useEffect(() => {
    if (!user) return;

    dispatch(
      fetchInventories({
        shipyardId: user.shipyard_id,
        queryParams: {
          page: currentPage,
          page_size: pageSize,
        },
      }),
    );
  }, [user]);

  useEffect((_) => (_) => dispatch(resetPagination()), [dispatch]);

  if ([status].includes("loading")) return <Loader />;

  return (
    <>
      <Typography
        variant="h2"
        sx={{
          fontSize: {
            xs: "h5.fontSize",
            md: "h2.fontSize",
          },
        }}
      >
        Manage Inventory
      </Typography>
      {_.isEmpty(shipyard) ? (
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
            </Stack>
          </Grid>
        </Grid>
      )}

      <MainCard content={false}>
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
            placeholder={`Search ${lists?.length} records...`}
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
                Create Inventory
              </Button>
            </Stack>
          </Stack>
        </Stack>

        {lists?.length ? (
          <ReactTable
            {...{
              data: lists,
              columns,
              globalFilter,
              setGlobalFilter,
              pagination,
              onPageChange: handlePageChange,
              currentPage,
              pageSize,
            }}
          />
        ) : (
          <EmptyReactTable columns={colsWithoutActions} />
        )}

        {inventoryModal && (
          <InventoryModal
            open={inventoryModal}
            modalToggler={modalToggler}
            shipyard={shipyard}
            inventory={selectedInventory}
          />
        )}
      </MainCard>
    </>
  );
};

export default ManageInventory;
