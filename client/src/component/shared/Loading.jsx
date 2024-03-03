import { Audio } from "react-loader-spinner";

const Loading = () => {
  const loadingStyle = {
    // height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
    color: "#fff",
  };

  return (
    <div className="loading" style={loadingStyle}>
      <Audio
        height="80"
        width="80"
        radius="9"
        color="#ccc"
        ariaLabel="loading"
        wrapperStyle
        wrapperClass
      />
    </div>
  );
};

export default Loading;
