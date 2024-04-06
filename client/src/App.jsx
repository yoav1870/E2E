import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile.jsx";
import CreateReport from "./pages/CreateReport";
import ReportPage from "./pages/ReportPage";
import EditProfile from "./pages/EditProfile";
import Information from "./pages/Information.jsx";
import Footer from "./component/Footer";
import ReportHistory from "./pages/ReportHistory";
import { Box } from "@mui/system";
import './app.css';

const App = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token !== null;
  };

  return (
    <BrowserRouter>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
          <Box
          className="content"
          sx={{
            flex: 1, // This will make sure that the content section grows to fill available space.
            // Add additional styling for the content container as necessary
          }}
        >
        <Routes>
          <Route
            path="/sign-in"
            element={isAuthenticated() ? <Navigate to="/home" /> : <SignIn />}
          />
          <Route
            path="/sign-up"
            element={isAuthenticated() ? <Navigate to="/home" /> : <SignUp />}
          />
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Navigate to="/home" />
              ) : (
                <Navigate to="/sign-in" />
              )
            }
          />
          <Route
            path="/home"
            element={
              isAuthenticated() ? <HomePage /> : <Navigate to="/sign-in" />
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated() ? <Profile /> : <Navigate to="/sign-in" />
            }
          />
          <Route
            path="/create-report"
            element={
              isAuthenticated() ? <CreateReport /> : <Navigate to="/sign-in" />
            }
          />
          <Route path="/reports/:id" element={<ReportPage />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/information" element={<Information />} />
          <Route
            path="/report-history"
            element={isAuthenticated() ? <ReportHistory /> : <Navigate to="/sign-in" />}
          />
      </Routes>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
};

export default App;
