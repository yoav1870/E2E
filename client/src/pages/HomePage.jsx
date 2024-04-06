// import React, { useEffect, useState } from 'react';
// import { Container, Typography, Grid, Card, CardContent, CardMedia, CircularProgress } from '@mui/material';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import Header from '../component/Header';
import SearchBar from '../component/SearchBar';
// const HomePage = () => {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('https://e2e-y8hj.onrender.com/api/reports/home', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setReports(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Failed to fetch reports:', error);
//         setLoading(false);

//         // Check if the error response status code is 404
//         if (error.response && error.response.status === 404) {
//           setError("Sorry, you haven't been placed yet");
//         } else if (error.response) {
//           console.error('Response data:', error.response.data);
//           console.error('Response status:', error.response.status);
//           console.error('Response headers:', error.response.headers);
//           setError(`Failed to fetch reports. Server responded with status code ${error.response.status}`);
//         } else if (error.request) {
//           console.error('No response received:', error.request);
//           setError('Failed to fetch reports. No response from the server.');
//         } else {
//           console.error('Error:', error.message);
//           setError('Failed to fetch reports. An error occurred.');
//         }
//       }
//     };
//     fetchReports();
//   }, []);

//   return (
//     <>
//       <Header />
//       <Container maxWidth="lg" sx={{ mt: 4 }}>
//         <Typography variant="h4" align="center" gutterBottom>
//           Welcome to the Homepage
//         </Typography>
//         {loading ? (
//           <Grid container justifyContent="center">
//             <CircularProgress />
//           </Grid>
//         ) : error ? (
//           <Typography variant="body1" align="center" color="error">
//             {error}
//           </Typography>
//         ) : reports.length === 0 ? (
//           <Typography variant="body1" align="center">
//             No reports found.
//           </Typography>
//         ) : (
//           <Grid container spacing={3}>
//             {reports.map((report) => (
//               <Grid item xs={12} sm={6} md={4} key={report._id}>
//                 <Link
//                   to={`/reports/${report._id}`}
//                   style={{ textDecoration: 'none' }}
//                 >
//                   <Card>
//                     {report.photo && (
//                       <CardMedia
//                         component="img"
//                         height="200"
//                         image={report.photo}
//                         alt={report.description}
//                       />
//                     )}
//                     <CardContent>
//                       <Typography variant="h6" gutterBottom>
//                         {report.description}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Status: {report.status}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Urgency: {report.urgency}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Date of Resolve: {new Date(report.dateOfResolve).toLocaleDateString()}
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Link>
//               </Grid>
//             ))}
//           </Grid>
//         )}

//       </Container>
//       {/* <Footer /> */}
//     </>
//   );
// };

// export default HomePage;

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../component/Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import FilterListIcon from "@mui/icons-material/FilterList";
// Extend dayjs with the isSameOrAfter plugin
dayjs.extend(isSameOrAfter);

const HomePage = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  dayjs.extend(isSameOrAfter);
  dayjs.extend(isSameOrBefore);
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://e2e-y8hj.onrender.com/api/reports/home",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReports(response.data);
        setFilteredReports(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setLoading(false);
      setError("Failed to fetch reports. Please try again later.");
      }
    };

    fetchReports();
  }, []);

  const handleFilter = (filtered) => {
    setFilteredReports(filtered);
  };

  // Filter reports based on the selected date range
  const filteredReports = reports.filter((report) => {
    const reportDate = dayjs(report.dateOfResolve);
    return (
      (!startDate || reportDate.isSameOrAfter(dayjs(startDate))) &&
      (!endDate || reportDate.isSameOrBefore(dayjs(endDate)))
    );
  });

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to the Homepage
        </Typography>
        <SearchBar reports={reports} onFilter={handleFilter} />
        {/* <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Grid item>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              isClearable
              placeholderText="Select a start date"
            />{" "}
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              isClearable
              placeholderText="Select an end date"
            />
          </Grid>
        </Grid> */}
       <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
          <IconButton aria-label="filter" onClick={() => setShowFilters(!showFilters)}>
            <FilterListIcon />
            <Typography variant="body1" color="textSecondary">
              Filter by date            </Typography>
          </IconButton>
        </Box>
        {showFilters && (
          <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              isClearable
              placeholderText="Start date"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              isClearable
              placeholderText="End date"
            />
          </Box>
        )}
        <SearchBar onSearch={handleSearch} />
        {loading ? (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : error ? (
          <Typography variant="body1" align="center" color="error">
            {error}
          </Typography>
        ) : filteredReports.length === 0 ? (
        ) : filteredReports.length === 0 ? (
          <Typography variant="body1" align="center">
            No reports found within the selected date range.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredReports.map((report) => (
            {filteredReports.map((report) => (
              <Grid item xs={12} sm={6} md={4} key={report._id}>
                <Link
                  to={`/reports/${report._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card>
                    {report.photo && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={report.photo}
                        alt="Report"
                      />
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
                        Date of Resolve:{" "}
                        {new Date(report.dateOfResolve).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default HomePage;
