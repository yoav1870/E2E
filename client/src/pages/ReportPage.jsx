import { useEffect, useState } from "react";
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
  MenuItem,
  Collapse,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
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
  const [selectedStatus, setSelectedStatus] = useState(report?.status || "");
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");
  const [showStatusUpdateMessage, setShowStatusUpdateMessage] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleDeleteConfirmation = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const updateReportStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://e2e-y8hj.onrender.com/api/reports/updateStatus/${id}`,
        { newStatus: selectedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setStatusUpdateMessage("Report status updated successfully.");
      setShowStatusUpdateMessage(true);
      setReport({ ...report, status: selectedStatus });
      setTimeout(() => {
        setShowStatusUpdateMessage(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to update report status:", error);
      setStatusUpdateMessage("Failed to update the report status.");
      setShowStatusUpdateMessage(true);
      setTimeout(() => {
        setShowStatusUpdateMessage(false);
      }, 2000);
    }
  };

  useEffect(() => {
    const fetchUserDetailsAndRole = async () => {
      try {
        const token = localStorage.getItem("token");
        const userResponse = await axios.get(
          "https://e2e-y8hj.onrender.com/api/users/home",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserRole(userResponse.data.role);

        if (report) {
          const userId =
            userResponse.data.role === "service_provider"
              ? report.reportByUser
              : report.assignedUser;
          const userDetailsResponse = await axios.get(
            `https://e2e-y8hj.onrender.com/api/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUserDetails(userDetailsResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch user details or role:", error);
      }
    };

    fetchUserDetailsAndRole();
  }, [report]);

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

  const updateReportDate = async () => {
    if (!newResolveDate) {
      setShowUpdateField(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://e2e-y8hj.onrender.com/api/reports/updateDate/${id}`,
        { newDateOfResolve: newResolveDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbarMessage("Report updated successfully.");
      setSnackbarOpen(true);
      setShowUpdateField(false);
      setTimeout(() => navigate("/home"), 4000);
    } catch (error) {
      console.error("Failed to update report:", error);
      setSnackbarMessage("Failed to update the report.");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const deleteReport = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://e2e-y8hj.onrender.com/api/reports/`, {
        data: { id },
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/home");
    } catch (error) {
      console.error("Failed to delete report:", error);
      setError("Failed to delete the report.");
    } finally {
      setOpenDialog(false);
    }
  };

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
        sx={{
          fontFamily: '"Times New Roman", serif',
          marginLeft: "10px",
          display: { xs: "none", sm: "flex" },
        }}
      >
        <Link component={RouterLink} color="inherit" to="/" underline="none">
          Home
        </Link>
        <Link component={RouterLink} color="inherit" underline="none">
          Report Details
        </Link>
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
        <Card sx={{ mb: 2, maxWidth: 600, mx: "auto" }}>
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
            {userRole === "service_provider" && (
              <>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}
                >
                  <TextField
                    select
                    label="Update Status"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    fullWidth
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </TextField>
                  <Button
                    variant="contained"
                    onClick={updateReportStatus}
                    sx={{ textTransform: "none" }}
                  >
                    Update
                  </Button>
                </Box>
              </>
            )}
            <Collapse in={showStatusUpdateMessage}>
              <Alert
                severity={
                  statusUpdateMessage.includes("successfully")
                    ? "success"
                    : "error"
                }
                sx={{ mt: 2 }}
              >
                {statusUpdateMessage}
              </Alert>
            </Collapse>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              {userRole !== "service_provider" && (
                <Button
                  onClick={updateReportDate}
                  variant="contained"
                  sx={{ textTransform: "none" }}
                >
                  {showUpdateField ? "Submit New Date" : "Update Resolve Date"}
                </Button>
              )}
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteConfirmation}
                sx={{ textTransform: "none" }}
              >
                Delete Report
              </Button>
            </Box>
          </CardContent>
        </Card>

        {userDetails && (
          <>
            <Typography
              variant="h5"
              gutterBottom
              fontFamily="Georgia, serif"
              textAlign="center"
              sx={{ mt: 4 }}
            >
              {userRole === "service_provider"
                ? "Client Details"
                : "Assigned Service Provider"}
            </Typography>
            <Card sx={{ mb: 2, maxWidth: 600, mx: "auto" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Name: {userDetails.username}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Email: {userDetails.email}
                </Typography>
                {userRole === "service_provider" && (
                  <Typography variant="body1" gutterBottom>
                    Location:{" "}
                    {Array.isArray(userDetails.location)
                      ? userDetails.location.join(", ")
                      : "Location unavailable"}
                  </Typography>
                )}
                {userRole !== "service_provider" && (
                  <>
                    <Typography variant="body1" gutterBottom>
                      Profession: {userDetails.profession}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Availability:{" "}
                      {userDetails.availability ? "Available" : "Not Available"}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Ranking: {userDetails.ranking}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Container>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this report? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={deleteReport} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
};

export default ReportPage;
