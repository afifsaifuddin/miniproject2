const db = require("../models");
const category = db.category;

const categoryController = {
  inputCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const data = await category.create({
        name,
      });
      res.status(200).json({
        success: "Input category success",
        data: data,
      });
    } catch (err) {
      res.status(200).json({
        error: "Input category failed",
      });
    }
  },
  getAllCategory: async (req, res) => {
    try {
      const data = await category.findAll();
      res.status(200).json({
        data: data,
      });
    } catch (err) {
      res.status(500).json({
        error: "get data category failed",
      });
    }
  },
};

module.exports = categoryController;
