import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CircularProgress, Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import Header from '../component/Header';
import LoadingComponent from '../component/Loading';

const ReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [assignedUser, setAssignedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newResolveDate, setNewResolveDate] = useState('');
  const [showUpdateField, setShowUpdateField] = useState(false); // State to control visibility

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

  useEffect(() => {
    const fetchAssignedUser = async () => {
      if (report && report.assignedUser) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`https://e2e-y8hj.onrender.com/api/users/${report.assignedUser}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setAssignedUser(response.data);
        } catch (error) {
          console.error('Failed to fetch assigned user:', error);
        }
      }
    };

    fetchAssignedUser();
  }, [report]);

  const updateReportDate = async () => {
    if (!showUpdateField) {
      setShowUpdateField(true);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://e2e-y8hj.onrender.com/api/reports/updateDate/${id}`,
        { newDateOfResolve: newResolveDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Report updated');
      setShowUpdateField(false); // Hide the input field again
      navigate('/home');
    } catch (error) {
      console.error('Failed to update report:', error);
      alert('Failed to update the report.');
    }
  };

  const deleteReport = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://e2e-y8hj.onrender.com/api/reports/`,
        {
          data: { id },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Report deleted');
      navigate('/home');
    } catch (error) {
      console.error('Failed to delete report:', error);
      alert('Failed to delete the report.');
    }
  };

  if (loading) {
    return (
     <LoadingComponent/>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>Error</Typography>
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
          <Typography variant="h4" gutterBottom>Report not found</Typography>
          <Typography variant="body1">The requested report could not be found.</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Report Details</Typography>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Description: {report.description}</Typography>
            <Typography variant="body1" gutterBottom>Status: {report.status}</Typography>
            <Typography variant="body1" gutterBottom>Urgency: {report.urgency}</Typography>
            <Typography variant="body1" gutterBottom>Date of Resolve: {new Date(report.dateOfResolve).toLocaleDateString()}</Typography>
            {showUpdateField && (
              <TextField
                label="New Resolve Date"
                type="date"
                fullWidth
                value={newResolveDate}
                onChange={(e) => setNewResolveDate(e.target.value)}
                sx={{ mt: 2, mb: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={updateReportDate} variant="contained">
                {showUpdateField ? 'Submit New Date' : 'Update Resolve Date'}
              </Button>
              <Button onClick={deleteReport} variant="contained" color="error">
                Delete Report
              </Button>
            </Box>
          </CardContent>
        </Card>
        {assignedUser && (
          <>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Assigned Service Provider</Typography>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Name: {assignedUser.username}</Typography>
                <Typography variant="body1" gutterBottom>Email: {assignedUser.email}</Typography>
                <Typography variant="body1" gutterBottom>Profession: {assignedUser.profession}</Typography>
                <Typography variant="body1" gutterBottom>Availability: {assignedUser.availability ? 'Available' : 'Not Available'}</Typography>
                <Typography variant="body1" gutterBottom>Ranking: {assignedUser.ranking}</Typography>
              </CardContent>
            </Card>
          </>
        )}
      </Container>
    </>
  );
};

export default ReportPage;
