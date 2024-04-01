import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import logo from '../assets/logo.png';

// Mock function to fetch user data
const fetchUserData = () => {
    return {
        username: "johndoe",
        email: "johndoe@example.com",
        role: "service_provider",
        location: {
            coordinates: [34.0522, -118.2437], // Example coordinates
        },
        description: "Experienced plumbing specialist in your area.",
        profession: "Plumber",
        availability: true,
        ranking: 5,
        photo: logo, // Using the logo as a placeholder for the user's photo
        createdAt: "2021-04-12T23:20:50.520Z",
    };
};

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = fetchUserData();
        setUser(userData);
    }, []);

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container component="main" maxWidth="sm" sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 5,
        }}>
            <Typography component="h1" variant="h4" fontWeight="bold" marginBottom={3}>
                User Profile
            </Typography>
            <Paper elevation={3} sx={{ width: '100%', padding: 4 }}>
                <Box component="img" src={user.photo} alt="Profile photo" sx={{ width: 100, height: 100, borderRadius: '50%', margin: 'auto' }} />
                <Typography variant="h6" fontWeight="bold" marginTop={2} textAlign="center">{user.username}</Typography>
                <Typography textAlign="center">{user.email}</Typography>
                <Typography textAlign="center" marginTop={1}>Role: {user.role}</Typography>
                <Typography textAlign="center">Location: {user.location.coordinates.join(', ')}</Typography>
                {user.description && <Typography textAlign="center" marginTop={1}>{user.description}</Typography>}
                
                {user.role === 'service_provider' && (
                    <React.Fragment>
                        <Typography textAlign="center" marginTop={1}>Profession: {user.profession}</Typography>
                        <Typography textAlign="center">Availability: {user.availability ? 'Available' : 'Not Available'}</Typography>
                        <Typography textAlign="center">Ranking: {user.ranking} stars</Typography>
                    </React.Fragment>
                )}

                <Typography textAlign="center" marginTop={2} color="text.secondary">Member since: {new Date(user.createdAt).toLocaleDateString()}</Typography>
            </Paper>
        </Container>
    );
};

export default UserProfile;
