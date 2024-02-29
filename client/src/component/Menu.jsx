import { useState } from "react";
import { Link } from "react-router-dom";
import { TbReportSearch } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";
import { CiHome } from "react-icons/ci";
const Menu = () => {
  const [hoveredButton, setHoveredButton] = useState(null);

  const menuStyle = {
    color: "white",
    backgroundColor: "#898F9C",
    padding: "5px",
    fontSize: "20px",
    display: "flex",
    flexDirection: "column",
  };

  const linkStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  };

  const ulStyle = {
    padding: "0px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  };

  const liStyle = {
    listStyleType: "none",
    margin: "20px 0px",
  };

  const handleMouseEnter = (linkId) => {
    setHoveredButton(linkId);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  return (
    <nav style={menuStyle}>
      <ul style={ulStyle}>
        <li style={liStyle}>
          <Link
            to="/"
            style={{
              ...linkStyle,
              color: hoveredButton === "home" ? "#4267B2" : "white",
            }}
            onMouseEnter={() => handleMouseEnter("home")}
            onMouseLeave={handleMouseLeave}
          >
            <CiHome />
            Home
          </Link>
        </li>
        <li style={liStyle}>
          <Link
            to="/reports"
            style={{
              ...linkStyle,
              color: hoveredButton === "reports" ? "#4267B2" : "white",
            }}
            onMouseEnter={() => handleMouseEnter("reports")}
            onMouseLeave={handleMouseLeave}
          >
            <TbReportSearch />
            Reports
          </Link>
        </li>
        <li style={liStyle}>
          <Link
            to="/oldreports"
            style={{
              ...linkStyle,
              color: hoveredButton === "oldreports" ? "#4267B2" : "white",
            }}
            onMouseEnter={() => handleMouseEnter("oldreports")}
            onMouseLeave={handleMouseLeave}
          >
            <FaRegTrashCan />
            Old reports
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
