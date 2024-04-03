import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile.jsx";
import CreateReport from "./pages/CreateReport";
import ReportPage from "./pages/ReportPage";
import EditProfile from "./pages/EditProfile";

const App = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token !== null;
  };

  return (
    <BrowserRouter>
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
          element={isAuthenticated() ? <Navigate to="/home" /> : <Navigate to="/sign-in" />}
        />
        <Route
          path="/home"
          element={isAuthenticated() ? <HomePage /> : <Navigate to="/sign-in" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated() ? <Profile /> : <Navigate to="/sign-in" />}
        />
        <Route
          path="/create-report"
          element={isAuthenticated() ? <CreateReport /> : <Navigate to="/sign-in" />}
        />
        <Route path="/reports/:id" element={<ReportPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;