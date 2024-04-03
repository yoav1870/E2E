import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box
      sx={{
        width: '100%', // Ensure full width
        backgroundColor: '#1D2830',
        color: 'white',
        py: 2, // Padding top and bottom
        mt: 'auto', // Automatically margin to push to bottom
        position: 'relative', // Adjust based on your layout needs
        bottom: 0,
        left: 0,
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <FaGithub size={30} style={{ color: 'white', marginBottom: '10px' }} />
        <Typography variant="body1" component="p">
          Noy Raichman | Yoav Zoker | Nour Muassi
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
