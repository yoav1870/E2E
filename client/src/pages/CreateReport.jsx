import React, { useState, useEffect } from 'react';
import { Collapse, Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import LoadingComponent from '../component/Loading';

const professions = ["electrician", "plumber", "Carpenter", "Technician"];

const validationSchema = yup.object({
  description: yup.string().required('Description is required'),
  profession: yup.string().required('Profession is required'),
  urgency: yup.number().min(1).max(5).required('Urgency is required'),
  dateOfResolve: yup.date().required('Date of Resolve is required').nullable(),
  range: yup.number().min(1).max(100).required('Range is required'),
});

const CreateReport = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState('');
  const [serviceProviderError, setServiceProviderError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://e2e-y8hj.onrender.com/api/users/home', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setLocation(response.data.location.coordinates.join(','));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const formik = useFormik({
    initialValues: {
      description: '',
      profession: '',
      urgency: '',
      dateOfResolve: '',
      range: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const updatedValues = {
          ...values,
          dateOfResolve: values.dateOfResolve ? new Date(values.dateOfResolve).toISOString() : null,
          location: {
            type: 'Point',
            coordinates: location.split(',').map(coord => parseFloat(coord.trim())),
          },
          reportByUser: user._id,
        };
    
        const token = localStorage.getItem('token');
        await axios.post('https://e2e-y8hj.onrender.com/api/reports', updatedValues, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate('/home');
      } catch (error) {
        // Check if the error is from Axios and has a response with the expected data
        if (error.response && typeof error.response.data === 'string') {
          setServiceProviderError(error.response.data);
        } else {
          console.error('Error creating report:', error);
        }
      }
    }
  });    

  if (!user) {
    return <LoadingComponent />;
  }

  return (
    <>
      <Header />
      <Container component="main" sx={{
        mx: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        paddingTop: '64px',
        width: { xs: '100%', sm: '600px', md: '500px' },
      }}>
        <Typography variant="h4" sx={{ mb: 4, fontFamily: "Georgia, serif" }}>Create Report</Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            autoFocus
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="profession-label">Profession</InputLabel>
            <Select
              labelId="profession-label"
              id="profession"
              name="profession"
              value={formik.values.profession}
              onChange={formik.handleChange}
              error={formik.touched.profession && Boolean(formik.errors.profession)}
            >
              {professions.map((profession) => (
                <MenuItem key={profession} value={profession}>{profession}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            id="urgency"
            label="Urgency (1-5)"
            name="urgency"
            type="number"
            InputProps={{ inputProps: { min: 1, max: 5 } }}
            value={formik.values.urgency}
            onChange={formik.handleChange}
            error={formik.touched.urgency && Boolean(formik.errors.urgency)}
            helperText={formik.touched.urgency && formik.errors.urgency}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="range"
            label="Range (1-100)"
            name="range"
            type="number"
            InputProps={{ inputProps: { min: 1, max: 100 } }}
            value={formik.values.range}
            onChange={formik.handleChange}
            error={formik.touched.range && Boolean(formik.errors.range)}
            helperText={formik.touched.range && formik.errors.range}
          />
          <TextField
            margin="normal"
            fullWidth
            id="dateOfResolve"
            label="Date of Resolve"
            type="date"
            name="dateOfResolve"
            value={formik.values.dateOfResolve}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 3, mb: 2 }}>
            <Button type="submit" variant="contained" sx={{ textTransform: "none" }}>
              Submit Report
            </Button>
          </Box>
          <Collapse in={Boolean(serviceProviderError)}>
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {serviceProviderError}
            </Typography>
          </Collapse>
        </form>
      </Container>
    </>
  );
};

export default CreateReport;
