import { useState } from "react";
import PropTypes from "prop-types";

const MockCreateReport = ({ isLoading }) => {
  const [formData, setFormData] = useState({
    description: "",
    profession: "",
    urgency: "",
    dateOfResolve: "",
    range: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    // Add logic to handle form submission
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Create Report</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="description">
          Description
          <input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="profession">
          Profession
          <input
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="urgency">
          Urgency (1-5)
          <input
            id="urgency"
            name="urgency"
            type="number"
            min="1"
            max="5"
            value={formData.urgency}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="range">
          Range (1-100)
          <input
            id="range"
            name="range"
            type="number"
            min="1"
            max="100"
            value={formData.range}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="dateOfResolve">
          Date of Resolve
          <input
            id="dateOfResolve"
            name="dateOfResolve"
            type="date"
            value={formData.dateOfResolve}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
};

MockCreateReport.propTypes = {
  isLoading: PropTypes.bool,
};

export default MockCreateReport;
