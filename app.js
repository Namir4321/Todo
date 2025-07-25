require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const port = process.env.port || 8000;
const AuthRoute = require("./Routes/AuthRoute");
const TaskRoute = require("./Routes/TaskRoute");
const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRoute);
app.use("/api/task",TaskRoute)
mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
