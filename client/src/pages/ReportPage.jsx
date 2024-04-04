import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Breadcrumbs,
  Link,
} from "@mui/material";
import axios from "axios";
import Header from "../component/Header";

const ReportPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [assignedUser, setAssignedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://e2e-y8hj.onrender.com/api/reports/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setReport(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch report:", error);
        setError("Failed to fetch the report. Please try again.");
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  useEffect(() => {
    const fetchAssignedUser = async () => {
      if (report && report.assignedUser) {
        try {
          const token = localStorage.getItem("token");
          // Include the assignedUser ID in the URL path as per your backend expectation
          const response = await axios.get(
            `https://e2e-y8hj.onrender.com/api/users/${report.assignedUser}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setAssignedUser(response.data);
        } catch (error) {
          console.error("Failed to fetch assigned user:", error);
        }
      }
    };

    fetchAssignedUser();
  }, [report]);

  if (loading) {
    return (
      <>
        <Header />
        <Container
          maxWidth="lg"
          sx={{ mt: 4, display: "flex", justifyContent: "center" }}
        >
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

      <Breadcrumbs
        aria-label="breadcrumb"
        style={{ fontFamily: '"Times New Roman", serif' }}
      >
        <Link
          component={RouterLink}
          color="inherit"
          to="/"
          style={{ fontFamily: '"Times New Roman", serif', marginLeft: "5px" }}
          underline="none"
        >
          Home
        </Link>
        <Typography
          color="text.primary"
          style={{ fontFamily: '"Times New Roman", serif' }}
        >
          Report Details
        </Typography>
      </Breadcrumbs>

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
              Date of Resolve:{" "}
              {new Date(report.dateOfResolve).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Assigned Service Provider
        </Typography>
        {assignedUser ? (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Name: {assignedUser.username}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Email: {assignedUser.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Profession: {assignedUser.profession}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Availability:{" "}
                {assignedUser.availability ? "Available" : "Not Available"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Ranking: {assignedUser.ranking}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Container>
    </>
  );
};

export default ReportPage;
