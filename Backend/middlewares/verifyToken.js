// verifyToken.js

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];
  if (!token) {
    return res.redirect("/login"); // Redirect to login if token is not present
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Set the decoded user object in the request
    next();
  } catch (error) {
    return res.redirect("/login"); // Redirect to login if token is invalid
  }
};

module.exports = verifyToken;
