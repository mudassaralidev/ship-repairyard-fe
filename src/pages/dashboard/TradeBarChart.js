import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import ReactApexChart from 'react-apexcharts';

const TradingMixChart = () => {
  const theme = useTheme();

  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      height: 400,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 4
      }
    },
    dataLabels: { enabled: false },
    stroke: { width: [0, 2], colors: ['transparent', theme.palette.primary.main] },
    xaxis: {
      categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10']
    },
    yaxis: { labels: { formatter: (val) => `${val}%` }, min: 0, max: 50 },
    grid: { borderColor: theme.palette.divider },
    colors: [theme.palette.warning.main, theme.palette.primary.main],
    legend: { show: true },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const trading = series[0][dataPointIndex];
        const expected_value = series[1][dataPointIndex];

        return `
            <div style="background: white; padding: 8px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
              <strong>${w.globals.labels[dataPointIndex]}</strong>
              <div style="margin-top: 5px;">
                <span style="color: #F59E0B;">● Trading: ${trading}%</span>
              </div>
              <div>
                <span style="color: #6366F1;">● Expected Value: ${expected_value}</span>
              </div>
            </div>
          `;
      }
    }
  });

  const [series, setSeries] = useState([
    {
      name: 'Trading',
      type: 'bar',
      data: [30, 40, 25, 35, 30, 50, 45, 40, 30, 35]
    },
    {
      name: 'Expectation',
      type: 'line',
      data: [25, 30, 28, 32, 30, 45, 40, 38, 32, 34]
    }
  ]);

  return (
    <MainCard sx={{ mt: 2 }} content={false}>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h6">Trade statistics</Typography>
        <Typography variant="body2" color="textSecondary">
          total profit/loss made : 45%
        </Typography>
        <Box sx={{ mt: 2 }}>
          <ReactApexChart options={options} series={series} type="bar" height={360} />
        </Box>
      </Box>
    </MainCard>
  );
};

export default TradingMixChart;
