// server.js
const express = require("express");
const cors = require("cors");
const userRouter = require("./routers/user.router");
const damageReportRouter = require("./routers/report.router");
const { NotFoundUrlError } = require("./errors/general.error");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/reports", damageReportRouter);

app.use((req, res, next) => {
  next(new NotFoundUrlError());
});

app.use((err, req, res, next) => {
  res.status(err?.status || 500).json(err.message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
