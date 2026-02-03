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
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { userTableColumns } from "utils/constants";
import { sySpecificUsers } from "../../redux/features/shipyard/actions";
import UserModal from "components/users/UserModal";
import AlertUserDelete from "components/users/AlertDelete";
import _ from "lodash";
import useAuth from "hooks/useAuth";
import { getDepartment, getDepartmentOptions } from "api/department";
import NoDataMessage from "components/@extended/NoDataMessage";
import DropdownDependencyInfo from "components/@extended/DropdownDependencyInfo";
import { resetShipyardState } from "../../redux/features/shipyard/slice";
import PaginatedAutocomplete from "components/@extended/PaginatedAutocomplete";

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

const ManageDeptUsers = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

  const dispatch = useDispatch();
  const {
    shipyard,
    shipyardUsers: lists,
    shipyardUsersPagination: pagination,
  } = useSelector((state) => state.shipyard);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  const [userModal, setUserModal] = useState(false);
  const [roleCategory, setRoleCategory] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteId, setDeleteId] = useState("");
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  const userColsWithoutActions = userTableColumns("deptUsers");

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(
    () => [
      ...userColsWithoutActions,

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
        },
      },
    ],
    [theme],
  );

  const modalToggler = () => {
    setUserModal(!userModal);
    setSelectedUser(null);
  };

  const handlePageChange = (newPage, newPageSize) => {
    if (newPageSize !== undefined) {
      setPageSize(newPageSize);
    } else {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    if (!user) return;

    try {
      (async () => {
        if (user.role === "FOREMAN") {
          const department = await getDepartment(user.department_id);
          setSelectedDepartment({
            value: department.id,
            label: department.name,
          });
        }

        setLoading(false);
      })();
    } catch (error) {
      console.error("Error occurred while getting departments", error);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !selectedDepartment?.value) return;

    dispatch(
      sySpecificUsers({
        shipyard_id: user?.shipyard_id,
        page: currentPage,
        page_size: pageSize,
        otherParams: {
          department_id: selectedDepartment.value,
          user_types: "deptMembers",
        },
      }),
    );
  }, [selectedDepartment]);

  useEffect((_) => (_) => dispatch(resetShipyardState()), [dispatch]);

  if (loading) return <></>;

  const renderInfoMessage = () => {
    if (_.isEmpty(selectedDepartment))
      return (
        <DropdownDependencyInfo
          visible={_.isEmpty(selectedDepartment)}
          requiredField="Department"
        />
      );

    if (!lists.length)
      return (
        <NoDataMessage message="No data available for DEPARTMENTAL users. You can create new one from above button" />
      );
  };

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
        Manage Departmental Users
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

              {/* Department Autocomplete */}
              {user?.department_id ? (
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel id="department-select-label">
                    Department
                  </InputLabel>
                  <Select
                    labelId="department-select-label"
                    id="department-select"
                    value={selectedDepartment?.value || ""}
                    label="Department"
                  >
                    <MenuItem value={selectedDepartment?.value}>
                      {selectedDepartment?.label}
                    </MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <PaginatedAutocomplete
                  sx={{ width: 300 }}
                  label="Select Department"
                  fetchOptionsApi={getDepartmentOptions}
                  extraParams={{ shipyardId: shipyard?.id }}
                  pageSize={100}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.value
                  }
                  getOptionLabel={(option) => option.name || ""}
                  onChange={(value) =>
                    setSelectedDepartment({
                      label: value.name,
                      value: value.id,
                    })
                  }
                />
              )}

              {user?.role !== "FOREMAN" &&
                !lists.some((user) => user.role.name === "FOREMAN") &&
                !_.isEmpty(selectedDepartment) && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setRoleCategory("foremen");
                      setUserModal(true);
                    }}
                  >
                    Add Foreman
                  </Button>
                )}
              {(user?.role === "FOREMAN" ||
                (lists.some((user) => user.role.name === "FOREMAN") &&
                  !_.isEmpty(selectedDepartment))) && (
                <Button
                  variant="contained"
                  onClick={() => {
                    setRoleCategory("employees");
                    setUserModal(true);
                  }}
                >
                  Add Employees
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      )}

      <MainCard content={false}>
        {!_.isEmpty(selectedDepartment) && lists?.length ? (
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
          </Stack>
        ) : (
          <></>
        )}

        {!_.isEmpty(selectedDepartment) && lists?.length ? (
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
          renderInfoMessage()
        )}
        {open && (
          <AlertUserDelete
            id={deleteId}
            title={deleteId}
            open={open}
            handleClose={handleClose}
          />
        )}
        {userModal && (
          <UserModal
            open={userModal}
            modalToggler={modalToggler}
            user={selectedUser}
            shipyard={{ value: shipyard?.id, label: shipyard?.name }}
            department={selectedDepartment}
            roleCategory={roleCategory}
          />
        )}
      </MainCard>
    </>
  );
};

export default ManageDeptUsers;
