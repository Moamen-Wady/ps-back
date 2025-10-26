const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
require("dotenv").config();
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://ps-ruby.vercel.app/",
    "https://ps-ruby.vercel.app",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use("/", require("./routes/getAll"));
app.use("/", require("./routes/pingRoute"));
app.use("/", require("./routes/psRoute"));
app.use("/", require("./routes/poolRoute"));

mongoose
  .connect(
    `mongodb+srv://${process.env.MDBUSER}:${process.env.MDBPWD}@cluster0.iumas.mongodb.net/${process.env.MDBDB}?retryWrites=true&w=majority`
  )
  .catch((err) => {
    console.log(err);
  })
  .then(console.log("connected"));
app.listen(3005, console.log("ok"));

app.get("/", (req, res) => {
  res.send("ok");
});
