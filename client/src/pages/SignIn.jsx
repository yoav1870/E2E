import React from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import logo from '../assets/logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = event.currentTarget.username.value;
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;
   
    const payload = {
      username,
      email,
      password,
    };

    try {
      const response = await axios.post("https://e2e-y8hj.onrender.com/api/users/sign-in", payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data); 
      navigate('/home'); 
    } catch (error) {
      if (error.response) {
   
        console.error("Backend returned an error:", error.response.data);
      } else if (error.request) {

        console.error("No response received:", error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 5 }}>
      <Typography component="h1" variant="h5" fontWeight="bold" fontSize="30px">
        Welcome to our System
      </Typography>
      <Box component="img" src={logo} alt="Logo" sx={{ width: 200, height: "auto", marginBottom: 2 }} />
      <form onSubmit={handleSubmit}>
        <TextField margin="normal" required fullWidth id="username" label="Username" name="username" autoComplete="username" autoFocus />
        <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" type="email" />
        <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Sign In
        </Button>
      </form>
    </Container>
  );
};

export default SignIn;
