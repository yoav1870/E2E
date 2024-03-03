import Alert from "@mui/material/Alert";
import { getReports } from "../service/service.reports";
import Loading from "./shared/Loading";

import { useState } from "react";
const Home = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [success, setSuccess] = useState(null);
  const allertStyle = {
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: "9999",
  };
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
          {error && (
            <Alert severity="error" style={allertStyle}>
              {error}
            </Alert>
          )}
          {/* {success && <Alert severity="success" style={allertStyle}>{success}</Alert>} */}
        </>
      )}
    </div>
  );
};

export default Home;
