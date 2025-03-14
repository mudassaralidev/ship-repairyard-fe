import React from 'react';
import { Collapse, Card, CardContent, Typography, Box, Grid } from '@mui/material';
import TradingMixChart from './TradeBarChart';

const TradeLogDetails = ({ isOpen, tradeData }) => {
  if (!tradeData) return null;
  tradeData = { ...tradeData, startDate: '05-15', runningDays: 12, endDate: '05-27 5:09 PM', withoutProfitDays: 7 };

  return (
    <Collapse in={isOpen} timeout={400}>
      <Card sx={{ mt: 2, boxShadow: 4, borderRadius: 2, bgcolor: '#f5f5f5' }}>
        <CardContent>
          <Box sx={{ p: 2 }}>
            {` You have started this trade on ${tradeData.startDate}.
              
              It has made no profit for ${tradeData.withoutProfitDays}days.
              
              The trade was started on ${tradeData.symbol} symbol.
              
              It was running for ${tradeData.runningDays} days.
              
              You have stopped it on ${tradeData.endDate}.
              
              Its entry price was ${tradeData.entry_price}.`
              .split('.')
              .map((sentence) => {
                return (
                  <Typography variant="body1" gutterBottom>
                    {sentence}.{' '}
                  </Typography>
                );
              })}
          </Box>
          <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">Trade Report</Typography>
              </Grid>
            </Grid>
            <TradingMixChart />
          </Grid>
        </CardContent>
      </Card>
    </Collapse>
  );
};

export default TradeLogDetails;
