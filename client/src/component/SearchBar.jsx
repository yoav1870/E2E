import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

const SearchBar = ({ onSearch }) => {
  const [searchProfession, setSearchProfession] = useState('');

  const handleSearch = () => {
    onSearch(searchProfession);
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" paddingBottom={4}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Search report by Profession"
          variant="outlined"
          fullWidth
          value={searchProfession}
          onChange={(e) => setSearchProfession(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Grid>
    </Grid>
  );
};

export default SearchBar;