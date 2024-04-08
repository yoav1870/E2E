import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Button,
  TextField,
  Breadcrumbs,
  Link,
  CardMedia,
} from "@mui/material";
import axios from "axios";
import Header from "../component/Header";

const ReportPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [assignedUser, setAssignedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newResolveDate, setNewResolveDate] = useState("");
    const [showUpdateField, setShowUpdateField] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserDetailsAndRole = async () => {
            try {
                const token = localStorage.getItem('token');
                const userResponse = await axios.get('http://localhost:3000/api/users/home', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserRole(userResponse.data.role);

                if (report) {
                    const userId = userResponse.data.role === 'service_provider' ? report.reportByUser : report.assignedUser;
                    const userDetailsResponse = await axios.get(`http://localhost:3000/api/users/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUserDetails(userDetailsResponse.data);
                }
            } catch (error) {
                console.error('Failed to fetch user details or role:', error);
            }
        };

        fetchUserDetailsAndRole();
    }, [report]);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/reports/${id}`, {
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

    const updateReportDate = async () => {
        if (!showUpdateField) {
            setShowUpdateField(true);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:3000/api/reports/updateDate/${id}`,
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
                `http://localhost:3000/api/reports/`,
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
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          fontFamily: '"Times New Roman", serif', marginLeft: '10px', 
          display: { xs: 'none', sm: 'flex' },
      }}      >      
        <Link component={RouterLink} color="inherit" to="/" underline="none">
          Home
        </Link>
        <Typography color="text.primary" fontFamily="Georgia, serif">
          Report Details
        </Typography>
      </Breadcrumbs>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          fontFamily="Georgia, serif"
          textAlign="center"
        >
          Report Details
        </Typography>
        <Card sx={{ mb: 2 }}>
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
              Date of Resolve:{" "}
              {new Date(report.dateOfResolve).toLocaleDateString()}
            </Typography>
            {report.photo && (
              <CardMedia
                component="img"
                height="300"
                image={report.photo}
                alt="Report Photo"
                sx={{ mt: 2 }}
              />
            )}
            {showUpdateField && (
              <TextField
                label="New Resolve Date"
                type="date"
                fullWidth
                value={newResolveDate}
                onChange={(e) => setNewResolveDate(e.target.value)}
                sx={{ mt: 2, mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            )}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                onClick={updateReportDate}
                variant="contained"
                sx={{ textTransform: "none" }}
              >
                {showUpdateField ? "Submit New Date" : "Update Resolve Date"}
              </Button>{" "}
              <Button
                onClick={deleteReport}
                variant="contained"
                color="error"
                sx={{ textTransform: "none" }}
              >
                Delete Report
              </Button>{" "}
            </Box>
          </CardContent>
        </Card>

                {userDetails && (
                    <>
                        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                            {userRole === 'service_provider' ? 'Client Details' : 'Assigned Service Provider'}
                        </Typography>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Name: {userDetails.username}</Typography>
                                <Typography variant="body1" gutterBottom>Email: {userDetails.email}</Typography>
                                {userRole === 'service_provider' && (
                                    <Typography variant="body1" gutterBottom>
                                        Location: {Array.isArray(userDetails.location) ? userDetails.location.join(', ') : 'Location unavailable'}
                                    </Typography>
                                )}
                                {userRole !== 'service_provider' && (
                                    <>
                                        <Typography variant="body1" gutterBottom>Profession: {userDetails.profession}</Typography>
                                        <Typography variant="body1" gutterBottom>Availability: {userDetails.availability ? 'Available' : 'Not Available'}</Typography>
                                        <Typography variant="body1" gutterBottom>Ranking: {userDetails.ranking}</Typography>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}

            </Container>
        </>
    );
};


export default ReportPage;