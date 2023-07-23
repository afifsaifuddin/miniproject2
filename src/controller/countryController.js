const db = require("../models");
const country = db.country;

const countryController = {
  createCountry: async (req, res) => {
    try {
      const { name } = req.body;
      const data = await country.create({
        name,
      });
      res.status(200).json({
        success: "input country success",
      });
    } catch (error) {
      res.status(500).json({
        error: "input country failed",
      });
    }
  },
  getAllcountry: async (req, res) => {
    try {
      const data = await country.findAll();
      res.status(200).json({
        success: "get data country success",
        data: data,
      });
    } catch (err) {
      res.status(500).json({
        error: "get data country failed",
      });
    }
  },
};
module.exports = countryController;
