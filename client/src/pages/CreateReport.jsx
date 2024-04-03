import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';

const professions = ["Electrician", "plumber", "Carpenter", "Technician"];

const validationSchema = yup.object({
  description: yup.string().required('Description is required'),
  profession: yup.string().required('Profession is required'),
  urgency: yup.number().min(1).max(5).required('Urgency is required'),
  dateOfResolve: yup.date().required('Date of Resolve is required'),
  range: yup.number().min(1).max(100).required('Range is required'),
});

const CreateReport = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState('');

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
      urgency: 4,
      dateOfResolve: '',
      range: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Convert dateOfResolve to ISO 8601 format with time
        const updatedValues = {
          ...values,
          dateOfResolve: new Date(values.dateOfResolve).toISOString(),
          location: {
            type: 'Point',
            coordinates: location.split(',').map(coord => parseFloat(coord.trim())),
          },
          reportByUser: user._id,
        };
        console.log('Sending report creation request with body:', updatedValues);

        const token = localStorage.getItem('token');
        await axios.post('https://e2e-y8hj.onrender.com/api/reports', updatedValues, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate('/home');
      } catch (error) {
        console.error('Error creating report:', error);
      }
    },
  });

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Header />
      <Container component="main" sx={{
        width: 500,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        paddingTop: '64px',
      }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Create Report</Typography>
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
            label="rang (1-100)"
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
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
            Submit Report
          </Button>
        </form>
      </Container>
    </>
  );
};

export default CreateReport;
