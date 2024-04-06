import React from 'react';
import { CircularProgress, Box, createTheme, ThemeProvider } from '@mui/material';
import Header from './Header';

// Custom theme to adjust colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // A shade of blue for the theme
    },
  },
});

const LoadingComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        
      >
        <Header/>
        <CircularProgress color="primary" />
      </Box>
    </ThemeProvider>
  );
};

export default LoadingComponent;
