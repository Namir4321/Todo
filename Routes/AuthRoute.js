const express = require("express");
const router = express.Router();
const authController = require("../Controller/AuthController");
const { userAuth } = require("../Middleware/auth");
router.post("/register", authController.SignupUser);
router.post("/login", authController.SigninUser);
router.post("/logout", authController.LogoutUser);
router.get("/getUser",userAuth,authController.getAllUser)
module.exports = router;
