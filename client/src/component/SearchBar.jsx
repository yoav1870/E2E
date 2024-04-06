import React, { useState } from 'react';
import { TextField, Grid, styled } from '@mui/material';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '24px',
    '&:hover': {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
  },
});

const SearchBar = ({ onSearch }) => {
  const [searchProfession, setSearchProfession] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchProfession);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" paddingBottom={4}>
      <Grid item xs={12} sm={6}>
        <StyledTextField
          label="Search report by Profession"
          variant="outlined"
          fullWidth
          value={searchProfession}
          onChange={(e) => setSearchProfession(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </Grid>
    </Grid>
  );
};

export default SearchBar;