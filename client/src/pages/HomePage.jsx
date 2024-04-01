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
        const response = await axios.get('https://e2e-y8hj.onrender.com/api/reports/home');
        setReports(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch reports. Please try again.');
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
        ) : (
          <Grid container spacing={3}>
            {reports.map((report) => (
              <Grid item xs={12} sm={6} md={4} key={report.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={report.photo}
                    alt={report.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {report.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {report.description}
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