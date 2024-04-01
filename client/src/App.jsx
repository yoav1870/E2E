import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile.jsx";
import CreateReport from "./pages/CreateReport.jsx";

const App = () => (
  <BrowserRouter>
  {/* <Header /> */}
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create-report" element={<CreateReport />} />
    </Routes>
  </BrowserRouter>
);

export default App;
