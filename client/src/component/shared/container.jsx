import PropTypes from "prop-types";

const Container = ({ children }) => {
  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    width: "100vw",
    height: "90vh",
  };

  return (
    <div className="container" style={containerStyle}>
      {children}
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Container;
