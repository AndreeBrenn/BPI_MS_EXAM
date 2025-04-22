const express = require("express");
const app = express();
const http = require("http");
const httpServer = http.createServer(app);
const cors = require("cors");
const cookies = require("cookie-parser");
const dotenv = require("dotenv").config();
const db = require("./models");

const EmployeeRoute = require("./routes/EmployeeRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(cookies());

app.use("/employee", EmployeeRoute);

// IMAGE ROUTES
app.use("/savedImages", express.static("savedImages"));

db.sequelize.sync().then(() => {
  httpServer.listen(3000, () => {
    console.log("Server Running");
  });
});
