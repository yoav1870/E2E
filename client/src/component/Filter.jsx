// DateFilter.js
import React, { useState, useEffect } from 'react';
import { TextField, Grid, styled, IconButton, Collapse, Button, Divider } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FilterListIcon from '@mui/icons-material/FilterList';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '24px',
    '&:hover': {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
  },
});

const DateFilter = ({ reports, onFilter }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    handleFilter();
  }, [startDate, endDate]);

  const handleFilter = () => {
    if (startDate && endDate) {
      const filteredReports = reports.filter((report) => {
        const reportDate = new Date(report.dateOfResolve);
        return reportDate >= startDate && reportDate <= endDate;
      });
      onFilter(filteredReports);
    } else {
      onFilter(reports);
    }
  };

  const handleResetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    onFilter(reports);
  };

  const handleIconClick = () => {
    setShowFilter(!showFilter);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container justifyContent="flex-end" alignItems="center" spacing={2} paddingBottom={4}>
        <Grid item>
          <IconButton onClick={handleIconClick}>
            <FilterListIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12}  >
          <Collapse in={showFilter}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Divider sx={{ borderColor: '#1976d2', borderWidth: '1px' }} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="center">
  <Button
    variant="outlined"
    onClick={handleResetFilter}
    sx={{
      textTransform: 'none', // Prevents the text from being capitalized
      marginTop: '8px', // Optional, for spacing
    }}
  >
    Reset Filter
  </Button>
</Grid>
              <Grid item xs={12}>
                <Divider sx={{ borderColor: '#1976d2', borderWidth: '1px' }} />
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DateFilter;