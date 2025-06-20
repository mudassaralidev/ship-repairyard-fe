import React from 'react';
import { Card, CardContent, Grid, Typography, Chip, Divider, Box } from '@mui/material';
import { CalendarOutlined, DollarOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const RepairDetailCard = ({ repair }) => {
  const statusColorMap = {
    INITIATED: 'warning',
    APPROVED: 'info',
    BLOCKED: 'error',
    COMPLETED: 'success'
  };

  const detailItems = [
    {
      label: 'Start Date',
      value: new Date(repair.start_date).toLocaleDateString(),
      icon: <CalendarOutlined style={{ fontSize: 18 }} />
    },
    {
      label: 'End Date',
      value: new Date(repair.end_date).toLocaleDateString(),
      icon: <CalendarOutlined style={{ fontSize: 18 }} />
    },
    {
      label: 'Estimated Cost',
      value: `$${repair.estimated_cost}`,
      icon: <DollarOutlined style={{ fontSize: 18 }} />
    },
    {
      label: 'Total Cost',
      value: repair.total_cost ? `$${repair.total_cost}` : 'N/A',
      icon: <DollarOutlined style={{ fontSize: 18 }} />
    },
    {
      label: 'Work Order Required',
      value: repair.requires_work_order ? 'Yes' : 'No',
      icon: repair.requires_work_order ? (
        <CheckCircleOutlined style={{ fontSize: 18, color: 'green' }} />
      ) : (
        <CloseCircleOutlined style={{ fontSize: 18, color: 'red' }} />
      )
    },
    {
      label: 'Subcontractor Required',
      value: repair.requires_subcontractor ? 'Yes' : 'No',
      icon: repair.requires_subcontractor ? (
        <CheckCircleOutlined style={{ fontSize: 18, color: 'green' }} />
      ) : (
        <CloseCircleOutlined style={{ fontSize: 18, color: 'red' }} />
      )
    },
    {
      label: 'Status',
      value: <Chip label={repair.status} color={statusColorMap[repair.status] || 'default'} variant="outlined" size="small" />
    }
  ];

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Description:
        </Typography>
        <Typography variant="body1" paragraph>
          {repair.description}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          {detailItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.label}>
              <Box display="flex" alignItems="center">
                {item.icon && <Box mr={1}>{item.icon}</Box>}
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {item.label}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RepairDetailCard;
