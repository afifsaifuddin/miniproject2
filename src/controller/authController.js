const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const user = db.user;
const fs = require("fs").promises;
const handlebars = require("handlebars");
const path = require("path");
const transporter = require("../../helpers/transporter");

const sendEmail = async (result) => {
  let payload = {
    id: result.id,
    isVerified: result.isVerified,
  };
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: "1h",
  });
  const redirect = `http://localhost:3000/verification?${token}`;
  const data = await fs.readFile(
    path.resolve(__dirname, "../emails/registeremail.html"),
    "utf-8"
  );
  const username = result.username;
  const tesCompile = handlebars.compile(data);
  const tempResult = tesCompile({ username, redirect });

  await transporter.sendMail({
    to: result.email,
    subject: "Account is Verified",
    html: tempResult,
  });
};

const cekLog = async (req) => {
  try {
    const { email, phone, username, password } = req.body;
    const loginby = {};
    if (email) {
      loginby.email = email;
    }
    if (phone) {
      loginby.phone = phone;
    }
    if (username) {
      loginby.username = username;
    }
    const checkLogin = await user.findOne({
      where: loginby,
    });
    return checkLogin;
  } catch (err) {
    return false;
  }
};
const authController = {
  register: async (req, res) => {
    try {
      const { username, phone, email, password, confirmpassword } = req.body;
      const isEmailExist = await user.findOne({ where: { email } });
      if (isEmailExist) {
        return res.status(500).json({
          message: "Email Already Exist",
        });
      }
      if (password !== confirmpassword) {
        res.status(500).json({ error: "password not match" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      await db.sequelize.transaction(async (t) => {
        const result = await user.create(
          { username, phone, email, password: hashPassword },
          { transaction: t }
        );
        await sendEmail(result);
        return res.status(200).json({ message: "success", data: result });
      });
    } catch (err) {
      return res.status(500).json({ message: "failed", error: err });
    }
  },
  login: async (req, res) => {
    try {
      const { password } = req.body;
      const checkLogin = await cekLog(req);
      if (!checkLogin) {
        return res.status(404).json({
          message: "Email,username or phone not found",
        });
      }
      const isValid = await bcrypt.compare(password, checkLogin.password);
      if (!isValid) return res.status(404).json({ message: "wrong pass" });
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
      return res.status(200).json({ message: "success", data: token });
    } catch (err) {
      return res.status(500).json({ message: "failed", error: err.message });
    }
  },
  statusverified: async (req, res) => {
    try {
      const { id } = req.user;
      const coba = await user.findByPk(id);
      if (coba.isVerified)
        return res.status(500).json({ message: "token has been used" });
      const updatestatus = await user.update(
        { isVerified: true },
        { where: { id: id } }
      );
      return res.status(200).json({
        succes: "Your account is verified",
      });
    } catch (error) {
      return res.status(500).json({
        error: "Your account is not verified",
      });
    }
  },
};

module.exports = authController;
