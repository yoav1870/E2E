import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile.jsx";
import CreateReport from "./pages/CreateReport";

const App = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token !== null;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Navigate to="/sign-in" />} />

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
      </Routes>
    </BrowserRouter>
  );
};

export default App;