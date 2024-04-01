import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Box,
} from "@mui/material";
import logo from "../assets/logo.png";

const SignIn = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get("username"),
      password: data.get("password"),
      email: data.get("email"),
    });
    // https://e2e-y8hj.onrender.com
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 5,
      }}
    >
      <Typography component="h1" variant="h5" fontWeight="bold" fontSize="30px">
        Welcome to the our System
      </Typography>
      <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{ width: 200, height: "auto", marginBottom: 2 }} // Adjust size as needed
      />

      <form onSubmit={handleSubmit}>
        {" "}
        {/* Ensure form takes up container width */}
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
