import { BrowserRouter,Routes,Route } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Profile from "./pages/Profile.jsx"

export default function App() {
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </BrowserRouter>
  
}
