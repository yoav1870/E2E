import { useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const mobileMenuId = "primary-search-account-menu-mobile";

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
      <MenuItem component={Link} to="/reports">
        All Reports
      </MenuItem>
      <MenuItem component={Link} to="/profile">
        My Profile
      </MenuItem>
      <MenuItem component={Link} to="/create-report">
        Create Report
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar
      position="static"
      color="default"
      elevation={4}
      sx={{
        backgroundColor: "#fff",
        color: "#333",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        minHeight: "100px",
        justifyContent: "center",
      }}
    >
      <Toolbar disableGutters sx={{ justifyContent: "space-between", padding: "0 20px" }}>
        <IconButton onClick={handleProfileClick}>
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
          <img src={logo} alt="Logo" style={{ height: "50px" }} />
        </Typography>
        {!isMobile && (
          <Box sx={{ display: "flex" }}>
            <MenuItem component={Link} to="/reports">
              All Reports
            </MenuItem>
            <MenuItem component={Link} to="/profile">
              My Profile
            </MenuItem>
            <MenuItem component={Link} to="/create-report">
              Create Report
            </MenuItem>
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
    </AppBar>
  );
};

export default Header;