import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Paper, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../component/Header";
import LoadingComponent from "../component/Loading";
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userResponse = await axios.get(
          "https://e2e-y8hj.onrender.com/api/users/home",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userLocation = userResponse.data.location.coordinates;
        const googleMapsApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation[1]},${userLocation[0]}&key=AIzaSyDDP0CzKiSUWI0tHWsPIZb4BHdE5j8BgQY`;

        const cityResponse = await axios.get(googleMapsApiUrl);
        const locationDescriptor = extractLocationDescriptor(cityResponse.data);

        const userDataWithLocation = {
          ...userResponse.data,
          location: locationDescriptor,
        };

        setUser(userDataWithLocation);
      } catch (error) {
        console.error("Failed to fetch user data or location:", error);
      }
    };

    fetchUserData();

    if (location.state && location.state.passwordUpdated) {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
  }, [location.state]);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (!user) {
    return <LoadingComponent />;
  }

  function extractLocationDescriptor(apiResponse) {
    const addressComponents = apiResponse.results[0]?.address_components;
    if (!addressComponents) return "Unknown Location";

    const preferredTypes = [
      "locality",
      "administrative_area_level_2",
      "administrative_area_level_1",
      "country",
    ];

    for (let type of preferredTypes) {
      const component = addressComponents.find((c) => c.types.includes(type));
      if (component) return component.long_name;
    }

    return apiResponse.results[0]?.formatted_address || "Unknown Location";
  }

  return (
    <>
      <Header />
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        {showSuccessMessage && (
          <Typography variant="body1" color="success" marginBottom={2}>
            Password updated successfully!
          </Typography>
        )}
        <Typography
          component="h1"
          variant="h4"
          // fontWeight="bold"
          marginBottom={3}
          fontFamily="Georgia, serif"
          // color={"#535252"}
        >
          User Profile
        </Typography>
        <Paper elevation={3} sx={{ width: "100%", padding: 4 }}>
          <Box
            component="img"
            src={user.photo}
            alt="Profile photo"
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              margin: "auto",
              display: 'block',
              objectFit: 'cover',
            }}
          />
          <Typography
            variant="h6"
            fontWeight="bold"
            marginTop={2}
            textAlign="center"
            fontFamily="serif"
          >
            {user.username}
          </Typography>
          <Typography textAlign="center" fontFamily="serif">
            {user.email}
          </Typography>
          <Typography textAlign="center" fontFamily="serif" marginTop={1}>
            Role: {user.role}
          </Typography>
          <Typography textAlign="center" fontFamily="serif">
            Location: {user.location}
          </Typography>
          {user.description && (
            <Typography textAlign="center" fontFamily="serif" marginTop={1}>
              {user.description}
            </Typography>
          )}
          {user.role === "service_provider" && (
            <>
              <Typography textAlign="center" fontFamily="serif" marginTop={1}>
                Profession: {user.profession}
              </Typography>
              <Typography textAlign="center" fontFamily="serif">
                Availability:{" "}
                {user.availability ? "Available" : "Not Available"}
              </Typography>
              <Typography textAlign="center" fontFamily="serif">
                Ranking: {user.ranking} stars
              </Typography>
            </>
          )}
          <Typography
            textAlign="center"
            marginTop={2}
            color="text.secondary"
            fontFamily="serif"
          >
            Member since: {new Date(user.createdAt).toLocaleDateString()}
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
          >
            <Button
              variant="contained"
              onClick={handleEditProfile}
              sx={{
                fontFamily: "'Tahoma', sans-serif",
                textTransform: 'none', 
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default UserProfile;
