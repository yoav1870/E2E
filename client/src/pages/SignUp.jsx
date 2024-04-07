import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Link, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import axios from 'axios';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
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
    photo: yup.string().url('Enter a valid URL'),
});

const SignUp = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            role: '',
            location: '',
            profession: '',
            description: '',
            photo: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {      
            const dataToSend = {
                ...values,
                location: {
                    type: "Point",
                    coordinates: values.location.split(',').map(coord => parseFloat(coord.trim()))
                },
            };

            try {
                await axios.post('https://e2e-y8hj.onrender.com/api/users/sign-up', dataToSend, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                navigate('/sign-in');
            } catch (error) {
                console.error('Sign up failed', error);
                const message = error.response && error.response.data ? error.response.data : 'Sign up failed. Please try again.';
                setError(message);
            }

            setSubmitting(false);
        },
    });

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

    return (
        <Container component="main"  maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2 }}>
            <Box component="img" src={logo} alt="Logo" sx={{ width: 150, height: 'auto', marginBottom: 2 }} />
            <Typography component="h1" variant="h5">Sign Up</Typography>

            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
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

                <TextField
                    margin="normal"
                    fullWidth
                    name="photo"
                    label="Photo URL"
                    value={formik.values.photo}
                    onChange={formik.handleChange}
                    error={formik.touched.photo && Boolean(formik.errors.photo)}
                    helperText={formik.touched.photo && formik.errors.photo}
                    placeholder="http://example.com/photo.jpg"
                />

                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={formik.isSubmitting}>
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