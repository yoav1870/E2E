import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, CircularProgress } from '@mui/material';
import axios from 'axios';
import Header from '../component/Header';

const HomePage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('https://e2e-y8hj.onrender.com/api/reports/home', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReports(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
          setError(`Failed to fetch reports. Server responded with status code ${error.response.status}`);
        } else if (error.request) {
          console.error('No response received:', error.request);
          setError('Failed to fetch reports. No response from the server.');
        } else {
          console.error('Error:', error.message);
          setError('Failed to fetch reports. An error occurred.');
        }
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to the Homepage
        </Typography>
        {loading ? (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : error ? (
          <Typography variant="body1" align="center" color="error">
            {error}
          </Typography>
        ) : reports.length === 0 ? (
          <Typography variant="body1" align="center">
            No reports found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {reports.map((report) => (
              <Grid item xs={12} sm={6} md={4} key={report._id}>
                <Card>
                  {report.photo && (
                    <CardMedia component="img" height="200" image={report.photo} alt={report.description} />
                  )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {report.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {report.status}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Urgency: {report.urgency}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date of Resolve: {new Date(report.dateOfResolve).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default HomePage;