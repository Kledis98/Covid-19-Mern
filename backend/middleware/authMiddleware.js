const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Admin = require("../Models/Admin");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  try {
    // Check if the token is present in the headers
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      console.log("No token present in headers");
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    // Get token from header
    token = req.headers.authorization.split(" ")[1];
    console.log("Token in Headers:", req.headers.authorization);

    // Verify token
    const decoded = jwt.verify(token, "secret");
    console.log("Decoded Token:", decoded);

    // Get admin from the token
    req.admin = await Admin.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Not authorized");
  }
});

module.exports = { protect };
