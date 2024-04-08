import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Breadcrumbs,
  Link,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import { Link as RouterLink } from "react-router-dom";
const EditProfile = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "https://e2e-y8hj.onrender.com/api/users/updatePassword",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data); // Password has been updated
      navigate("/profile", { state: { passwordUpdated: true } });
    } catch (error) {
      console.error("Failed to update password:", error);
      // Handle error, display error message, etc.
    }
  };

  return (
    <>
      <Header />

      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          fontFamily: '"Times New Roman", serif',
          marginLeft: "10px",
          display: { xs: "none", sm: "flex" },
        }}
      >
        <Link
          component={RouterLink}
          color="inherit"
          to="/"
          style={{ fontFamily: '"Times New Roman", serif' }}
          underline="none"
        >
          Home
        </Link>
        <Link
          component={RouterLink}
          color="inherit"
          to="/profile"
          style={{ fontFamily: '"Times New Roman", serif', marginLeft: "5px" }}
          underline="none"
        >
          profile
        </Link>

        <Link
          component={RouterLink}
          color="inherit"
          to="/edit-profile"
          style={{ fontFamily: '"Times New Roman", serif', marginLeft: "5px" }}
          underline="none"
        >
          Edit profile
        </Link>
      </Breadcrumbs>
      <Container maxWidth="sm" sx={{ marginTop: 5 }}>
        <Typography
          variant="h4"
          align="center"
          fontFamily='"Times New Roman", serif'
          gutterBottom
        >
          Edit Profile
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <TextField
            type="password"
            label="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              marginTop: 2,
              justifyContent: "center",
              fontFamily: '"Times New Roman", serif',
            }}
          >
            Update Password
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default EditProfile;
