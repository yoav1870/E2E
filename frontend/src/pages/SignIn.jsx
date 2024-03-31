import React from 'react';
import { Container, Typography, TextField, Button, Link, Box } from '@mui/material';
import logo from '../assets/images/logo.png';

const SignIn = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get('username'),
      password: data.get('password'),
      email: data.get('email'),
    });
    // Add your sign-in logic here
  };

  return (
    <Container component="main" maxWidth="xs" sx={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', // This ensures that the container takes up the full viewport height
    }}>
      {/* Logo at the top of the form */}
      <Box 
        component="img"
        src={logo}
        alt="Logo"
        sx={{ width: 100, height: 100, marginBottom: 2 }} // Adjust size as needed
      />
      <Typography component="h1" variant="h5">
        Sign In
      </Typography>
      <form onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}> {/* Ensure form takes up container width */}
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          type="email"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Typography textAlign="center" sx={{ mt: 2 }}>
          Not registered yet?{' '}
          <Link href="/sign-up" variant="body2">
            Create an account now!
          </Link>
        </Typography>
      </form>
    </Container>
  );
};

export default SignIn;
