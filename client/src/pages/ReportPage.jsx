import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import axios from 'axios';
import Header from '../component/Header';

const ReportPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://e2e-y8hj.onrender.com/api/reports/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReport(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch report:', error);
        setError('Failed to fetch the report. Please try again.');
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1">{error}</Typography>
        </Container>
      </>
    );
  }

  if (!report) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Report not found
          </Typography>
          <Typography variant="body1">
            The requested report could not be found.
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Report Details
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Description: {report.description}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Status: {report.status}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Urgency: {report.urgency}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Date of Resolve: {new Date(report.dateOfResolve).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Assigned Service Provider
        </Typography>
        {/* Display the assigned service provider details */}
        {/* You can fetch the service provider data based on the report.assignedUser */}
      </Container>
    </>
  );
};

export default ReportPage;