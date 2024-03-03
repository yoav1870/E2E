import Alert from "@mui/material/Alert";
import { getReports } from "../service/service.reports";
import Loading from "./shared/Loading";
import Container from "./shared/container";

import { useState } from "react";
const Home = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [success, setSuccess] = useState(null);

  const handleError = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };
  // const handleSuccess = (message) => {
  //   setSuccess(message);
  //   setTimeout(() => {
  //     setSuccess(null);
  //   }, 5000);
  // };

  const getAllReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
      setLoading(false);
    } catch (error) {
      handleError(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <Loading></Loading>}
      {!loading && (
        <>
          {error && <Alert severity="error">{error}</Alert>}
          {/* {success && <Alert severity="success">{success}</Alert>} */}
          <p>Welcome to the home page</p>
        </>
      )}
    </div>
  );
};

export default Home;
