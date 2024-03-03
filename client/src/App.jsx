import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Header from "./component/Header";
import Menu from "./component/Menu";
import ContainerRow from "./component/shared/container";
import Home from "./component/Home";
import Login from "./component/Login";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuthentication = (isAuthenticated) => {
    setAuthenticated(isAuthenticated);
  };

  return (
    <Router>
      {authenticated ? (
        <>
          <Header />
          <ContainerRow>
            <Menu />
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Define other routes here */}
            </Routes>
          </ContainerRow>
        </>
      ) : (
        <Login authenticate={handleAuthentication} />
      )}
    </Router>
  );
};

export default App;
