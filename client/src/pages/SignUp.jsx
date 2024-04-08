import React, { useState } from 'react';
import {
    Container, Typography, TextField, Button, FormControl,
    InputLabel, Select, MenuItem, Box
} from '@mui/material';
import axios from 'axios';
import logo from '../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().min(8, 'Password should be of minimum 8 characters length').required('Password is required'),
    role: yup.string().required('Role is required'),
    location: yup.string().required('Location is required'),
    profession: yup.string().when('role', (role, schema) =>
        role === 'service_provider' ? schema.required('Profession is required for service providers.') : schema
    ),
    // Removing photo validation since it's now a file
});

const SignUp = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLocationFocus = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                formik.setFieldValue('location', `${latitude.toFixed(6)},${longitude.toFixed(6)}`);
            }, (error) => {
                console.error("Error obtaining geolocation:", error);
                alert("Error obtaining geolocation. Please enter manually.");
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
            alert("Geolocation is not supported by this browser. Please enter manually.");
        }
    };

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            role: '',
            location: '',
            profession: '',
            description: '',
            photo: null, // Changed to null since it will be a File object
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                if (key === 'location') {
                    const [latitude, longitude] = values[key].split(',');
                    formData.append('location[type]', 'Point');
                    formData.append('location[coordinates][0]', latitude.trim());
                    formData.append('location[coordinates][1]', longitude.trim());
                } else if (key !== 'photo') {
                    formData.append(key, values[key]);
                } else if (values.photo) {
                    formData.append('photo', values.photo);
                }
            });

            axios.post('http://localhost:3000/api/users/sign-up', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(() => navigate('/sign-in'))
                .catch((error) => {
                    const message = error.response?.data || 'Sign up failed. Please try again.';
                    setError(message);
                });
        },
    });
    // Added to handle file selection
    const handlePhotoChange = (event) => {
        formik.setFieldValue("photo", event.currentTarget.files[0]);
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2 }}>
            <Box component="img" src={logo} alt="Logo" sx={{ width: 150, height: 'auto', marginBottom: 2 }} />
            <Typography component="h1" variant="h5">Sign Up</Typography>
            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }} encType="multipart/form-data">
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
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
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="location"
                    label="Location (latitude, longitude)"
                    onFocus={handleLocationFocus}
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    error={formik.touched.location && Boolean(formik.errors.location)}
                    helperText={formik.touched.location && formik.errors.location}
                    placeholder="34.0522, -118.2437"
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role"
                        name="role"
                        value={formik.values.role}
                        label="Role"
                        onChange={formik.handleChange}
                        error={formik.touched.role && Boolean(formik.errors.role)}
                    >
                        <MenuItem value="service_request">Service Request</MenuItem>
                        <MenuItem value="service_provider">Service Provider</MenuItem>
                    </Select>
                    {formik.touched.role && formik.errors.role && <Typography color="error">{formik.errors.role}</Typography>}
                </FormControl>

                {formik.values.role === 'service_provider' && (
                    <>
                        <TextField
                            margin="normal"
                            required={formik.values.role === 'service_provider'}
                            fullWidth
                            name="profession"
                            label="Profession"
                            autoComplete="profession"
                            value={formik.values.profession}
                            onChange={formik.handleChange}
                            error={formik.touched.profession && Boolean(formik.errors.profession)}
                            helperText={formik.touched.profession && formik.errors.profession}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="description"
                            label="Description"
                            autoComplete="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                        />
                    </>
                )}


                <input
                    accept="image/*"
                    type="file"
                    id="photo"
                    name="photo"
                    onChange={handlePhotoChange}
                    style={{ marginTop: '10px' }}
                />
                {formik.touched.photo && formik.errors.photo && <Typography color="error" style={{ marginTop: '5px' }}>{formik.errors.photo}</Typography>}

                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Sign Up
                </Button>
                {error && <Typography color="error">{error}</Typography>}
                <Typography textAlign="center">
                    Already have an account? <Link href="/sign-in" variant="body2">Sign in here!</Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default SignUp;
