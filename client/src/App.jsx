import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import Menu from "./component/Menu";
import ContainerRow from "./component/shared/container";
import Home from "./component/Home";
// import Report from "./component/Report";
// import Oldreports from "./component/Old-reports";

const App = () => {
  return (
    <Router>
      <Header />
      <ContainerRow>
        <Menu />
        <Routes>
          <Route exact path="/" element={<Home />} />
          {/* <Route path="/report" element={<Report />} /> */}
          {/* <Route path="/old-reports" element={<Oldreports />} /> */}
        </Routes>
      </ContainerRow>
    </Router>
  );
};

export default App;
