import React from 'react';
import { Box, Typography } from '@mui/material';
import { FrownOutlined } from '@ant-design/icons';

const NoDataMessage = ({ message = 'No data available' }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      bgcolor="#f9f9f9"
      border="1px dashed #ccc"
      borderRadius={2}
      p={0}
    >
      <FrownOutlined fontSize="large" color="disabled" />
      <Typography variant="h6" color="textSecondary" mt={1}>
        {message}
      </Typography>
    </Box>
  );
};

export default NoDataMessage;
