import { useEffect, useState } from 'react';
import { Stack, Typography, Paper, Box, CircularProgress, Grid } from '@mui/material';
import { ArrowUpOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getRepairHistory } from 'api/repair';

const ExpandingRepairHistory = ({ repairId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const res = await getRepairHistory(repairId);
        setHistory(res);
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    };

    getHistory();
  }, [repairId]);

  if (loading) return <CircularProgress size={24} sx={{ ml: 2 }} />;

  if (history.length === 0) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          textAlign: 'center',
          bgcolor: '#f0f2f5',
          border: '1px dashed #d9d9d9'
        }}
      >
        <InfoCircleOutlined style={{ fontSize: 28, color: '#999' }} />
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          No repair history available yet.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          All changes or updates will appear here as a timeline.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      {history.map((item, index) => {
        const data = JSON.parse(item.data);
        const InfoLine = ({ label, value }) => (
          <Typography variant="h6">
            <Box component="span" fontWeight={600} color="#1a237e">
              {label}:
            </Box>{' '}
            {value}
          </Typography>
        );
        return (
          <Stack key={item.id} direction="row" alignItems="flex-start" spacing={2} sx={{ position: 'relative' }}>
            <Box sx={{ pt: 1 }}>
              {/* {!isLast && ( */}
              <ArrowUpOutlined
                style={{
                  fontSize: 18,
                  color: '#1890ff',
                  transform: 'translateY(20px)'
                }}
              />
              {/* )} */}
            </Box>

            <Paper
              elevation={3}
              sx={{
                p: 2,
                bgcolor: '#f9f9f9',
                borderLeft: '4px solid #1890ff',
                borderRight: '4px solid #1890ff',
                width: '100%'
              }}
            >
              <Grid container spacing={2}>
                {/* LEFT SIDE - InfoLines */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InfoLine label="Updated At" value={dayjs(item.createdAt).format('DD MMM YYYY, hh:mm A')} />

                    {data.change_request && <InfoLine label="Change Request From" value={data.change_request} />}

                    {data.updated_reason && <InfoLine label="Updated Reason" value={data.updated_reason} />}
                  </Stack>
                </Grid>

                {/* RIGHT SIDE - Additional Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">
                    <strong style={{ color: '#1a237e' }}>Previous Description:</strong> {data.description}
                  </Typography>

                  <Typography variant="h6">
                    <strong style={{ color: '#1a237e' }}>Previous Estimated Cost:</strong> ${data.estimated_cost}
                  </Typography>

                  <Typography variant="h6">
                    <strong style={{ color: '#1a237e' }}>Previous Start Date:</strong> {dayjs(data.start_date).format('DD MMM YYYY')}
                  </Typography>

                  <Typography variant="h6">
                    <strong style={{ color: '#1a237e' }}>Previous End Date:</strong> {dayjs(data.end_date).format('DD MMM YYYY')}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default ExpandingRepairHistory;
