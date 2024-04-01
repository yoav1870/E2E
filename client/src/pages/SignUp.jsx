import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Link, FormControl, RadioGroup, FormControlLabel, Radio, FormGroup, Checkbox, InputLabel, Select, MenuItem, Box } from '@mui/material';
import axios from 'axios';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        role: '',
        location: '',
        profession: '',
        description: '',
        availability: false,
        ranking: '',
        photo: '',
    });
    const [error, setError] = useState(''); // State to hold error messages from the server
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setUserData({ ...userData, availability: e.target.checked });
    };

    const handleLocationFocus = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserData({ ...userData, location: `${latitude.toFixed(6)},${longitude.toFixed(6)}` });
            }, (error) => {
                console.error("Error obtaining geolocation:", error);
                alert("Error obtaining geolocation. Please enter manually.");
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
            alert("Geolocation is not supported by this browser. Please enter manually.");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSend = {
            ...userData,
            location: {
                type: "Point",
                coordinates: userData.location.split(',').map(coord => parseFloat(coord.trim()))
            },
        };

        try {
            const response = await axios.post('https://e2e-y8hj.onrender.com/api/users', dataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Sign up successful', response.data);
            // Redirect to the home page upon successful sign-up
            navigate('/home');
        } catch (error) {
            console.error('Sign up failed', error);
            // Extract and show detailed error message from server
            const message = error.response && error.response.data ? error.response.data : 'Sign up failed. Please try again.';
            setError(message); // Set the detailed error message from the server
        }
    };  

    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2 }}>
            <Box component="img" src={logo} alt="Logo" sx={{ width: 150, height: 'auto', marginBottom: 2 }} />
            <Typography component="h1" variant="h5">Sign Up</Typography>
            
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField margin="normal" required fullWidth id="username" label="Username" name="username" autoComplete="username" autoFocus value={userData.username} onChange={handleInputChange} />
                <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" type="email" value={userData.email} onChange={handleInputChange} />
                <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="new-password" value={userData.password} onChange={handleInputChange} />
                <TextField margin="normal" required fullWidth name="location" label="Location (latitude, longitude)" onFocus={handleLocationFocus} value={userData.location} onChange={handleInputChange} placeholder="34.0522, -118.2437" />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select labelId="role-label" id="role" name="role" value={userData.role} label="Role" onChange={handleInputChange}>
                        <MenuItem value="service_request">Service Request</MenuItem>
                        <MenuItem value="service_provider">Service Provider</MenuItem>
                    </Select>
                </FormControl>

                {userData.role === 'service_provider' && (
                    <>
                        <TextField margin="normal" required fullWidth name="profession" label="Profession" autoComplete="profession" value={userData.profession} onChange={handleInputChange} />
                        <TextField margin="normal" fullWidth name="description" label="Description" autoComplete="description" value={userData.description} onChange={handleInputChange} />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="ranking"
                            label="Ranking"
                            name="ranking"
                            autoComplete="ranking"
                            type="number"
                            InputProps={{ inputProps: { min: 1, max: 5 } }} // Ensure the ranking is within 1-5
                            value={userData.ranking}
                            onChange={handleInputChange}
                        />

                    </>
                )}

                <TextField margin="normal" fullWidth name="photo" label="Photo URL" value={userData.photo} onChange={handleInputChange} placeholder="http://example.com/photo.jpg" />

                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>

                <Typography textAlign="center">
                    Already have an account? <Link href="/sign-in" variant="body2">Sign in here!</Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default SignUp;
