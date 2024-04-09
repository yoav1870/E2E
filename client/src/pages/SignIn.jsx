import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Collapse,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/icon_logo.png";

const SignIn = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
        // Clear the error message after the collapse animation completes
        // to remove the space it occupied.
        setTimeout(() => setErrorMessage(""), 300); // Adjust time as needed based on animation duration
      }, 2000); // Wait for 2 seconds before hiding the message
    }
  }, [errorMessage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;

    // Reset error states upon submission attempt
    setEmailError(!email);
    setPasswordError(!password);

    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://e2e-y8hj.onrender.com/api/users/sign-in",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/home");
      // window.location.reload();
    } catch (error) {
      if (error.response) {
        setErrorMessage("Invalid email or password");
      } else {
        console.error("Error:", error.message);
      }
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ height: "50px", marginTop: "20px" }}
        />
        <Typography component="h1" variant="h5" style={{ margin: "20px" }}>
          Sign In
        </Typography>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          error={emailError}
          helperText={emailError && "Email is required"}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          error={passwordError}
          helperText={passwordError && "Password is required"}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ margin: "24px 0px 16px" }}
        >
          Sign In
        </Button>
        <Collapse in={showErrorMessage}>
          <Typography
            color="error"
            align="center"
            style={{ marginBottom: "12px" }}
          >
            {errorMessage}
          </Typography>
        </Collapse>
        <Typography align="center">
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
