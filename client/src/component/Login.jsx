import { useState } from "react";
import PropTypes from "prop-types";

const Login = ({ authenticate }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate authentication (replace with actual authentication logic)
    const { email, password } = credentials;
    if (email === "user@example.com" && password === "password") {
      authenticate(true); // Set authentication state to true
    } else {
      setError("Invalid email or password");
    }
  };

  const loginStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#4267B2",
    width: "30vw",
  };

  const pageStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    color: "white",
  };

  const leftStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "30vw",
    color: "#4267B2",
  };

  const inputStyle = {
    margin: "10px",
    padding: "10px",
    border: "none",
    borderBottom: "1px solid black",
    backgroundColor: "transparent",
    color: "#4267B2",
  };

  const buttonStyle = {
    margin: "10px",
    padding: "10px",
    border: "none",
    backgroundColor: "#4267B2",
    color: "white",
    cursor: "pointer",
    // hover: "black",
  };

  return (
    <div style={pageStyle}>
      <div style={leftStyle}>
        <h1>Our app</h1>
        Welcome to our app. Please verify your email and password.
      </div>
      <form onSubmit={handleSubmit} style={loginStyle}>
        <input
          style={inputStyle}
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <input
          style={inputStyle}
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button style={buttonStyle} type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

Login.propTypes = {
  authenticate: PropTypes.func.isRequired,
};

export default Login;
