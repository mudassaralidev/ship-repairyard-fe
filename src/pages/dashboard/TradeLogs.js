import PropTypes from 'prop-types';
import { Fragment, useMemo, useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  InputLabel,
  Stack,
  TablePagination,
  Button,
  Box,
  SliderTrack
} from '@mui/material';

// third-party
import { DndProvider } from 'react-dnd';
import { isMobile } from 'react-device-detect';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { getCoreRowModel, flexRender, useReactTable } from '@tanstack/react-table';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import IconButton from 'components/@extended/IconButton';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import TradeLogDetails from './TradeLogDetails';
import dayjs from 'dayjs';

const tableData = [
  {
    id: 1,
    symbol: 'SYM1',
    line_1_price: 120,
    line_2_price: 850,
    entry_price: 160,
    power_price: 50.08,
    turbo_price: 66.34,
    fire_price: 119.5,
    average_price: 54,
    profit_loss: 'Profit',
    RSI: '45.2'
  },
  {
    id: 2,
    symbol: 'SYM2',
    line_1_price: 125,
    line_2_price: 870,
    entry_price: 170,
    power_price: 55.3,
    turbo_price: 70.1,
    fire_price: 130.5,
    average_price: 58,
    profit_loss: 'Loss',
    RSI: '50.1'
  },
  {
    id: 3,
    symbol: 'SYM3',
    line_1_price: 115,
    line_2_price: 810,
    entry_price: 158,
    power_price: 48.9,
    turbo_price: 65.2,
    fire_price: 118.4,
    average_price: 52,
    profit_loss: 'No Profit',
    RSI: 'N/A'
  },
  {
    id: 4,
    symbol: 'SYM4',
    line_1_price: 135,
    line_2_price: 890,
    entry_price: 180,
    power_price: 60.2,
    turbo_price: 72.5,
    fire_price: 140.6,
    average_price: 61,
    profit_loss: 'Profit',
    RSI: '55.4'
  },
  {
    id: 5,
    symbol: 'SYM5',
    line_1_price: 110,
    line_2_price: 780,
    entry_price: 150,
    power_price: 45.6,
    turbo_price: 60.8,
    fire_price: 110.2,
    average_price: 50,
    profit_loss: 'Loss',
    RSI: '42.3'
  },
  {
    id: 6,
    symbol: 'SYM6',
    line_1_price: 140,
    line_2_price: 900,
    entry_price: 185,
    power_price: 62.8,
    turbo_price: 75.4,
    fire_price: 145.3,
    average_price: 63,
    profit_loss: 'Profit',
    RSI: '58.7'
  },
  {
    id: 7,
    symbol: 'SYM7',
    line_1_price: 130,
    line_2_price: 880,
    entry_price: 175,
    power_price: 58.1,
    turbo_price: 71.9,
    fire_price: 135.7,
    average_price: 59,
    profit_loss: 'No Profit',
    RSI: 'N/A'
  },
  {
    id: 8,
    symbol: 'SYM8',
    line_1_price: 145,
    line_2_price: 920,
    entry_price: 190,
    power_price: 65.4,
    turbo_price: 78.2,
    fire_price: 150.8,
    average_price: 66,
    profit_loss: 'Loss',
    RSI: '61.2'
  },
  {
    id: 9,
    symbol: 'SYM9',
    line_1_price: 100,
    line_2_price: 750,
    entry_price: 140,
    power_price: 40.7,
    turbo_price: 55.3,
    fire_price: 100.5,
    average_price: 48,
    profit_loss: 'Profit',
    RSI: '38.5'
  },
  {
    id: 10,
    symbol: 'SYM10',
    line_1_price: 138,
    line_2_price: 910,
    entry_price: 188,
    power_price: 64.1,
    turbo_price: 76.9,
    fire_price: 148.6,
    average_price: 65,
    profit_loss: 'No Profit',
    RSI: 'N/A'
  },
  {
    id: 11,
    symbol: 'SYM11',
    line_1_price: 128,
    line_2_price: 860,
    entry_price: 168,
    power_price: 53.2,
    turbo_price: 69.4,
    fire_price: 127.8,
    average_price: 57,
    profit_loss: 'Loss',
    RSI: '47.9'
  },
  {
    id: 12,
    symbol: 'SYM12',
    line_1_price: 118,
    line_2_price: 820,
    entry_price: 162,
    power_price: 49.5,
    turbo_price: 67.2,
    fire_price: 122.3,
    average_price: 55,
    profit_loss: 'Profit',
    RSI: '43.8'
  },
  {
    id: 13,
    symbol: 'SYM13',
    line_1_price: 132,
    line_2_price: 870,
    entry_price: 172,
    power_price: 56.9,
    turbo_price: 72.1,
    fire_price: 132.4,
    average_price: 60,
    profit_loss: 'No Profit',
    RSI: 'N/A'
  },
  {
    id: 14,
    symbol: 'SYM14',
    line_1_price: 142,
    line_2_price: 930,
    entry_price: 192,
    power_price: 68.5,
    turbo_price: 79.7,
    fire_price: 155.2,
    average_price: 68,
    profit_loss: 'Profit',
    RSI: '63.5'
  },
  {
    id: 15,
    symbol: 'SYM15',
    line_1_price: 105,
    line_2_price: 770,
    entry_price: 145,
    power_price: 42.3,
    turbo_price: 58.7,
    fire_price: 105.8,
    average_price: 49,
    profit_loss: 'Loss',
    RSI: '40.1'
  }
];

const SimpleExpandableTable = ({ data, columns }) => {
  const theme = useTheme();
  const [expandedRows, setExpandedRows] = useState({});
  const [page, setPage] = useState(0);
  const [paginatedData, setPaginatedData] = useState([...data.slice(0, 5)]);
  const rowsPerPage = 5;

  const backColor = alpha(theme.palette.primary.lighter, 0.1);

  const handleChangePage = (_, newPage) => {
    const start = rowsPerPage * newPage;
    const end = rowsPerPage * (newPage + 1);
    setPaginatedData([...data.slice(start, end)]);
    setPage(newPage);
  };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0); // Reset to first page
  // };

  const table = useReactTable({
    columns,
    data: paginatedData,
    getCoreRowModel: getCoreRowModel()
  });

  const toggleRow = (rowId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {table.getFlatHeaders().map((header) => (
                <TableCell key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow onClick={() => toggleRow(row.id)} style={{ cursor: 'pointer' }}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
                {expandedRows[row.id] && (
                  <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` } }}>
                    <TableCell colSpan={row.getVisibleCells().length + 2}>
                      <TradeLogDetails isOpen={row.id} tradeData={row.original} />
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        // onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10]}
      />
    </>
  );
};

SimpleExpandableTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  setData: PropTypes.func
};

// ==============================|| REACT TABLE - UMBRELLA ||============================== //

const TradeLogs = () => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());

  const [data, setData] = useState(tableData.map((data, idx) => ({ ...data, idx: idx + 1, status: 'Stopped' })));

  const columns = useMemo(
    () => [
      {
        id: 'expander',
        Header: '',
        Cell: ({ row }) => (
          <IconButton onClick={() => row.toggleRowExpanded()}>{row.getIsExpanded() ? <UpOutlined /> : <DownOutlined />}</IconButton>
        )
      },
      {
        id: 'idx',
        title: 'Sr.No#',
        header: 'Sr.No#',
        accessorKey: 'idx',
        dataType: 'text',
        enableColumnFilter: false,
        enableGrouping: false
      },
      {
        id: 'symbol',
        header: 'symbol',
        accessorKey: 'symbol',
        enableColumnFilter: false,
        enableGrouping: false,
        dataType: 'text'
      },
      {
        id: 'RSI',
        header: 'RSI',
        footer: 'RSI',
        accessorKey: 'RSI',
        dataType: 'text',
        enableGrouping: false
      },
      {
        id: 'power_price',
        header: 'Power Price',
        footer: 'Power Price',
        accessorKey: 'power_price',
        dataType: 'text',
        enableGrouping: false
      },
      {
        id: 'turbo_price',
        header: 'Turbo Price',
        footer: 'Turbo Price',
        accessorKey: 'turbo_price',
        dataType: 'text',
        enableGrouping: false
      },
      {
        id: 'fire_price',
        header: 'Fire Price',
        footer: 'Fire Price',
        accessorKey: 'fire_price',
        dataType: 'text',
        enableGrouping: false
      },
      {
        id: 'average_price',
        header: 'Average Price',
        footer: 'Average Price',
        accessorKey: 'average_price',
        dataType: 'text',
        enableGrouping: false
      },
      {
        id: 'profit_loss',
        header: 'Profit/Loss',
        footer: 'Profit/Loss',
        accessorKey: 'profit_loss',
        dataType: 'text',
        enableGrouping: false
      },
      {
        id: 'status',
        header: 'Status',
        footer: 'Status',
        accessorKey: 'status',
        dataType: 'text',
        enableGrouping: false,
        meta: {
          className: 'cell-right'
        }
      }
    ],
    // eslint-disable-next-line
    []
  );

  return (
    <Grid container rowSpacing={3} columnSpacing={2} alignItems="center">
      {/* <Grid container rowSpacing={3} columnSpacing={2} alignItems="center"> */}
      <Grid item xs={12}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={1}>
                <InputLabel htmlFor="from_date">From Date</InputLabel>
                <DatePicker value={startDate} onChange={(date) => setStartDate(date)} maxDate={dayjs()} />
              </Stack>
            </LocalizationProvider>
          </Box>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={1}>
                <InputLabel htmlFor="end_date">End Date</InputLabel>
                <DatePicker value={endDate} onChange={(date) => setEndDate(date)} minDate={startDate} maxDate={dayjs()} />
              </Stack>
            </LocalizationProvider>
          </Box>
          <Stack sx={{ justifyContent: { xs: 'stretch', md: 'flex-end' }, paddingBottom: { md: '5px' } }}>
            <Button variant="contained">Get Filtered Logs</Button>
          </Stack>
        </Stack>
      </Grid>
      {/* </Grid> */}
      <Grid item xs={12}>
        {' '}
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
          <SimpleExpandableTable {...{ data, columns, setData }} />
        </DndProvider>
      </Grid>
    </Grid>
  );
};

export default TradeLogs;
