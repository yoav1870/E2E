import { Link } from "react-router-dom";

const Header = () => {
  const HeaderStyle = {
    backgroundColor: "#4267B2",
    color: "white",
    padding: "5px 0px",
    height: "10vh",
    width: "100vw",
    textAlign: "left",
  };

  const h1Style = {
    margin: "10px",
    color: "white",
  };

  return (
    <div style={HeaderStyle}>
      <Link to="/">
        <h1 style={h1Style}>Our app</h1>
      </Link>
    </div>
  );
};

export default Header;
