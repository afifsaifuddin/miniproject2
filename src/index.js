const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();

const db = require("./models");
// db.sequelize.sync({ alter: true });

const { getRouter } = require("./router");

app.use("/image-blog", express.static(path.resolve(__dirname, "../public")));

app.use(express.json());
app.use("/miniproject", getRouter);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
