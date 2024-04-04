import React from "react";
import { Container, Typography, TextField, Button, Link } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/icon_logo.png";
const SignIn = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    try {
      const response = await axios.post(
        "https://e2e-y8hj.onrender.com/api/users/sign-in",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { token } = response.data;
      localStorage.setItem("token", token);
    
      window.location.href = "/home";
    } catch (error) {
      if (error.response) {
        console.error("Backend returned an error:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "20px",
        }}
      >
        <img src={logo} alt="Logo" style={{ height: "50px" }} />
        <Typography
          variant="body1"
          color="#170F49"
          sx={{
            ml: 1,
            fontSize: "1.50rem",
            fontWeight: "bold",
          }}
        >
          Reports
        </Typography>
      </Container>
      <Typography component="h1" variant="h6" fontSize="1rem">
        Sign In
      </Typography>
      <form onSubmit={handleSubmit}>
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
          Not registered yet?{" "}
          <Link href="/sign-up" variant="body2">
            Create an account now!
          </Link>
        </Typography>
      </form>
    </Container>
  );
};

export default SignIn;
