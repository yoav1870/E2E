import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import logo from "../assets/icon_logo.png";


// JWT token decoding function (add this outside your component or in a utility file)
function decodeJWT(token) {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(payload);
}

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);

  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    // Decode the JWT token and set the user role
    const token = localStorage.getItem("token");
    const decodedToken = decodeJWT(token);
    const role = decodedToken ? decodedToken.role : "";
    setUserRole(role);
  }, []);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };

  const handleSignOut = () => {
    // Remove the authentication token from local storage
    localStorage.removeItem("token");

    // Remove any stored user data from local storage
    localStorage.removeItem("user");

    localStorage.removeItem("role");

    // Redirect to the sign-in page using window.location.href
    window.location.href = "/sign-in";
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const profileMenuId = "primary-search-account-menu";

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(mobileMenuAnchorEl)}
      onClose={handleMobileMenuClose}
    >
      <MenuItem component={Link} to="/home">
        All Reports
      </MenuItem>
      <MenuItem component={Link} to="/profile">
        My Profile
      </MenuItem>
    
      {!userRole || userRole !== "service_provider" && (
        <MenuItem component={Link} to="/create-report">Create Report</MenuItem>
      )}
    </Menu>
  );

  const renderProfileMenu = (
    <Menu
      anchorEl={profileMenuAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={profileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(profileMenuAnchorEl)}
      onClose={handleProfileMenuClose}
    >
      <MenuItem component={Link} to="/profile" onClick={handleProfileMenuClose}>
        My Profile
      </MenuItem>
      <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
    </Menu>
  );

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={4}
      sx={{
        backgroundColor: "#E7E7E7",
        color: "#333",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        justifyContent: "center",
        minHeight: "70px",
      }}
    >
      <Toolbar
        disableGutters
        sx={{ justifyContent: "space-between", padding: "0 20px" }}
      >
        <IconButton onClick={handleProfileMenuOpen}>
          <Avatar alt="Profile Picture" src="path/to/profile-picture.jpg" />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
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
            </Link>
          </Box>
        </Typography>
        {!isMobile && (
          <Box sx={{ display: "flex" }}>
            <MenuItem component={Link} to="/home">
              All Reports
            </MenuItem>
            <MenuItem component={Link} to="/profile">
              My Profile
            </MenuItem>

            {userRole !== "service_provider" && (
              <MenuItem component={Link} to="/create-report">
                Create Report
              </MenuItem>
            )}
          </Box>
        )}
        {isMobile && (
          <IconButton
            size="large"
            edge="end"
            aria-label="menu"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
      {renderMobileMenu}
      {renderProfileMenu}
    </AppBar>
  );
};

export default Header;
