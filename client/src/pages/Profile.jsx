import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userResponse = await axios.get('https://e2e-y8hj.onrender.com/api/users/home', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userLocation = userResponse.data.location.coordinates;
        const googleMapsApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation[1]},${userLocation[0]}&key=AIzaSyB2yu1H1oGeSVPlsxVO6k14GtjUa4KTu54`;

        const cityResponse = await axios.get(googleMapsApiUrl);
        console.log(cityResponse.data);

        const addressComponents = cityResponse.data.results[0]?.address_components;
        const cityComponent = addressComponents.find(component => component.types.includes('locality') || component.types.includes('administrative_area_level_2'));
        const cityName = cityComponent ? cityComponent.long_name : 'Unknown Location';

        const userDataWithCity = {
          ...userResponse.data,
          location: cityName,
        };

        setUser(userDataWithCity);
      } catch (error) {
        console.error('Failed to fetch user data or city name:', error);
        // Implement more user-friendly error handling as needed
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
    navigate('/edit-profile');
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container component="main" maxWidth="sm" sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 5,
    }}>
      {showSuccessMessage && (
        <Typography variant="body1" color="success" marginBottom={2}>
          Password updated successfully!
        </Typography>
      )}
      <Typography component="h1" variant="h4" fontWeight="bold" marginBottom={3}>
        User Profile
      </Typography>
      <Paper elevation={3} sx={{ width: '100%', padding: 4 }}>
        <Box component="img" src={user.photo} alt="Profile photo" sx={{ width: 100, height: 100, borderRadius: '50%', margin: 'auto' }} />
        <Typography variant="h6" fontWeight="bold" marginTop={2} textAlign="center">{user.username}</Typography>
        <Typography textAlign="center">{user.email}</Typography>
        <Typography textAlign="center" marginTop={1}>Role: {user.role}</Typography>
        <Typography textAlign="center">Location: {user.location}</Typography>
        {user.description && <Typography textAlign="center" marginTop={1}>{user.description}</Typography>}
        {user.role === 'service_provider' && (
          <>
            <Typography textAlign="center" marginTop={1}>Profession: {user.profession}</Typography>
            <Typography textAlign="center">Availability: {user.availability ? 'Available' : 'Not Available'}</Typography>
            <Typography textAlign="center">Ranking: {user.ranking} stars</Typography>
          </>
        )}
        <Typography textAlign="center" marginTop={2} color="text.secondary">Member since: {new Date(user.createdAt).toLocaleDateString()}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
          <Button variant="contained" onClick={handleEditProfile}>
            Edit Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfile;
