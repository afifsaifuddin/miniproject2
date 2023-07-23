const db = require("../models");
const user = db.user;

const getAccount = {
  getbyId: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await user.findOne({
        where: {
          id,
        },
      });
      return res.status(200).json({
        message: "get data success",
        data: result,
      });
    } catch (err) {
      return res.status(500).json({
        message: "get data failed",
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const result = await user.findAll();
      res.status(200).json({
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        error: "get data user failed",
      });
    }
  },
};

module.exports = getAccount;
