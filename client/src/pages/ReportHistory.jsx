import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Breadcrumbs,
  Link,
  CardMedia,
} from "@mui/material";
import Header from "../component/Header";
import { Link as RouterLink } from "react-router-dom";

const ReportsHistory = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReportsHistory = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://e2e-y8hj.onrender.com/api/reports/past",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReports(response.data);
      } catch (err) {
        console.error("Failed to fetch reports history:", err);
        setError("Failed to load reports history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportsHistory();
  }, []);

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
        <Link
          component={RouterLink}
          color="inherit"
          to="/"
          style={{ fontFamily: '"Times New Roman", serif' }}
          underline="none"
        >
          Home
        </Link>
        <Link
          component={RouterLink}
          color="inherit"
          to="/report-history"
          style={{ fontFamily: '"Times New Roman", serif', marginLeft: "5px" }}
          underline="none"
        >
          report history
        </Link>
      </Breadcrumbs>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          fontFamily="Georgia, serif"
        >
          Reports History
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {reports.map((report) => (
              <Grid item xs={12} sm={6} md={4} key={report._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">
                      {report.photo ? (
                        <CardMedia
                          component="img"
                          height="300"
                          image={report.photo}
                          alt="Report Photo"
                          sx={{ mt: 2 }}
                        />
                      ) : (
                        <CardMedia
                          component="img"
                          height="300"
                          image="https://s3.eu-central-1.amazonaws.com/report.photo.bucket/defult_report.png"
                          alt="Defult Photo"
                          sx={{ mt: 2 }}
                        />
                      )}
                    </Typography>
                    <Typography variant="h6">{report.description}</Typography>
                    <Typography color="text.secondary">
                      Resolve Date:{" "}
                      {new Date(report.dateOfResolve).toLocaleDateString()}
                    </Typography>
                    <Typography color="text.secondary">
                      Status: {report.status}
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

export default ReportsHistory;
