const jwt = require("jsonwebtoken");
const { NotAuthorizedError } = require("../errors/general.error");
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    const error = new NotAuthorizedError();
    return res.status(error.status).send(error.message);
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(403).send("Access Denied / Unauthorized request");
  }
};

module.exports = authenticateToken;
