const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const user = db.user;

const authController = {
  register: async (req, res) => {
    try {
      const { username, phone, email, password } = req.body;
      const isEmailExist = await user.findOne({
        where: {
          email,
        },
      });
      if (isEmailExist) {
        return res.status(500).json({
          message: "Email Already Exist",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      await db.sequelize.transaction(async (t) => {
        const result = await user.create(
          {
            username,
            phone,
            email,
            password: hashPassword,
          },
          { transaction: t }
        );
        return res.status(200).json({
          message: "Registrasi Success",
          data: result,
        });
      });
    } catch (err) {
      return res.status(500).json({
        message: "Registrasi Failed",
        error: err.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkLogin = await user.findOne({
        where: {
          email,
        },
      });
      if (!checkLogin) {
        return res.status(404).json({
          message: "Email not found",
        });
      }
      const isValid = await bcrypt.compare(password, checkLogin.password);
      if (!isValid) {
        return res.status(404).json({
          message: "password is incorrect",
        });
      }
      let payload = {
        id: checkLogin.id,
        email: checkLogin.email,
        username: checkLogin.username,
        phone: checkLogin.phone,
        isVerified: checkLogin.isVerified,
      };

      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: "1h",
      });
      return res.status(200).json({
        message: "Login success",
        data: token,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Login Failed",
        error: err.message,
      });
    }
  },
};

module.exports = authController;
