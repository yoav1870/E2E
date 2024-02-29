const express = require("express");
const cors = require("cors");
const { reportRouter } = require("./router/report.router");
const { NotFoundUrlError } = require("./errors/errors");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/report", reportRouter);
app.use("*", (req, res, next) => {
  next(new NotFoundUrlError());
});
app.use((err, req, res, next) => {
  if (err instanceof NotFoundUrlError) {
    res.status(err?.status || 500).json(err.message);
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
