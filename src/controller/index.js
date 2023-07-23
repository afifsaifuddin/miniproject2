const getAccount = require("./getAccount");
const authController = require("./authController");
const changeController = require("./changeProfile");
const createBlog = require("./createBlog");
const createCategory = require("./categoryController");
const createCountry = require("./countryController");
module.exports = {
  getAccount,
  authController,
  changeController,
  createBlog,
  createCategory,
  createCountry,
};
