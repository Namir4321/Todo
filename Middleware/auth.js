const jwt = require("jsonwebtoken");
const User = require("../model/User");
const cookieParser = require("cookie-parser");

const userAuth = async (req, res, next) => {

  try {
    const cookies = req.cookies;
    const { token } = cookies;
    //   validate the token
    if (!token) {
      throw new Error("You are not authenticated");
    }
    const decodedToken = await jwt.verify(token, "secret key");
    const { _id } = decodedToken;
    //   Find the user by ID
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    // Attach user to the request object
    req.user = user;
    // Call the next middleware or route handler
    next();
    //   If token is valid, proceed to the next middleware or route handler
  } catch (err) {
    // If token is invalid, throw an error
    console.error("Authentication error:", err);
    return res.status(401).json({ error: err.message });
  }
  // Read token from the request cookies
};
module.exports = {
  userAuth,
};
