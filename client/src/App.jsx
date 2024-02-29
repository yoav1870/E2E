import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import Header from "./component/Header";
import Menu from "./component/Menu";
import ContainerRow from "./component/shared/container";

const App = () => {
  return (
    <Router>
      <Header />
      <ContainerRow>
        <Menu />
      </ContainerRow>
    </Router>
  );
};

export default App;
