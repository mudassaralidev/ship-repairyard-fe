import React from 'react';
import { Alert, Box } from '@mui/material';
import { InfoCircleOutlined } from '@ant-design/icons';

const DropdownDependencyInfo = ({ visible, requiredField, message, icon }) => {
  if (!visible) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Alert severity="info" icon={icon || <InfoCircleOutlined />} sx={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
        {message || `Please select a ${requiredField} before proceeding.`}
      </Alert>
    </Box>
  );
};

export default DropdownDependencyInfo;
