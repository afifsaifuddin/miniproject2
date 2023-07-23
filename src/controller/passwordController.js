const db = require("../models");
const user = db.user;
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs").promises;
const transporter = require("../../helpers/transporter");
const handlebars = require("handlebars");
const bcrypt = require("bcrypt");

const passwordController = {
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const isemailExist = await user.findOne({
        where: {
          email,
        },
      });
      if (!isemailExist) {
        return res.status(500).json({
          error: "email not found",
        });
      }

      let payload = {
        id: isemailExist.id,
        email: isemailExist.email,
      };
      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: "1h",
      });
      const redirect = `http://localhost:3000/reset-password?${token}`;
      const data = await fs.readFile(
        path.resolve(__dirname, "../emails/forgotpassword.html"),
        "utf-8"
      );
      const tesCompile = handlebars.compile(data);
      const tempResult = tesCompile({ redirect });

      await transporter.sendMail({
        to: email,
        subject: "Forgot Password",
        html: tempResult,
      });
      return res.status(200).json({
        success: "please check your email",
      });
    } catch (error) {
      res.status(500).json({
        error: "forget password failed",
      });
    }
  },
  resetPassword: async (req, res) => {
    const { id, email } = req.user;
    try {
      const { newpassword, confirmpassword } = req.body;
      const getuser = await user.findOne({
        where: {
          id: id,
        },
      });
      if (newpassword !== confirmpassword) {
        return res.status(500).json({
          error: "password not match",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashnewpassword = await bcrypt.hash(newpassword, salt);
      await getuser.update({
        password: hashnewpassword,
        where: { id },
      });
      const data = await fs.readFile(
        path.resolve(__dirname, "../emails/changeemail.html"),
        "utf-8"
      );
      const tesCompile = handlebars.compile(data);
      const tempResult = tesCompile({
        x: "Passowrd",
      });
      await transporter.sendMail({
        to: email,
        subject: "Password has changed",
        html: tempResult,
      });
      return res.status(200).json({
        success: "reset password success",
      });
    } catch (err) {
      return res.status(500).json({
        error: "reset password failed",
      });
    }
  },
};

module.exports = passwordController;
