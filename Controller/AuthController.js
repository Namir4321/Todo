const {
  userSignUpSchema,
  validationWithZodSchema,
  userSignInSchema,
} = require("../utils/validator");
const User = require("../model/User");
const { hashedPassword } = require("../utils/Helper");
exports.SignupUser = async (req, res, next) => {
  console.log(req.body)
  try {
    const ValidatedFields = await validationWithZodSchema(
      req.body,
      userSignUpSchema
    );
    const hashpassword = await hashedPassword(ValidatedFields.password);

    // Check if the user already exists
    const existingUser = await User.findOne({ email: ValidatedFields.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({
      firstName: ValidatedFields.firstName,
      lastName: ValidatedFields.lastName,
      email: ValidatedFields.email,
      password: hashpassword,
    });

    await user.save();
    return res.status(200).json("User created successfully");
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

exports.SigninUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const ValidatedFields = await validationWithZodSchema(
      { email, password },
      userSignInSchema
    );
    const user = await User.findOne({ email: ValidatedFields.email });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }
    const isPasswordValid = await user.comparePassword(
      ValidatedFields.password
    );
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      });
      const userData = user.toObject();
      delete userData.password;
      res.json({ user: userData, message: "Login Successful" });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

exports.LogoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
