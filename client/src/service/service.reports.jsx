const getReports = async () => {
  try {
    const response = await fetch("/api/reports");
    const reports = await response.json();
    if (reports.status === 200) {
      return reports;
    } else {
      throw new Error(reports);
    }
  } catch (error) {
    throw new Error(
      "There was a problem with the server to load the data. Please try again later."
    );
  }
};

export { getReports };
