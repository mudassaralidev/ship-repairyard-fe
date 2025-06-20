import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import _ from 'lodash';

const Dropdown = ({ label, value, onChange, options = [], getOptionLabel, disabled = false }) => (
  <FormControl sx={{ minWidth: 200 }} disabled={disabled}>
    <InputLabel id={`${label.toLowerCase()}-label`}>{label}</InputLabel>
    <Select
      labelId={`${label.toLowerCase()}-label`}
      id={`${label.toLowerCase()}-select`}
      value={value || ''}
      label={label}
      onChange={onChange}
    >
      {options.map((option, idx) => (
        <MenuItem key={idx} value={option}>
          {getOptionLabel(option, idx)}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default Dropdown;
