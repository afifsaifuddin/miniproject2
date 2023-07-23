const express = require("express");
const db = require("../models");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const getuser = db.user;
const transporter = require("../../helpers/transporter");
const path = require("path");
const handlebars = require("handlebars");

const changeController = {
  changePassword: async (req, res) => {
    const { id } = req.user;
    try {
      const { oldpassword, newpassword, confirmpassword } = req.body;
      const user = await getuser.findOne({
        where: {
          id,
        },
      });
      if (!user) {
        return res.status(404).json({
          error: "Account not Found",
        });
      }
      const passwordMatch = await bcrypt.compare(oldpassword, user.password);
      if (!passwordMatch) {
        return res.status(500).json({
          error: "oldpassword invalid",
        });
      }
      if (newpassword !== confirmpassword) {
        res.status(500).json({ error: "password not match" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashnewpassword = await bcrypt.hash(newpassword, salt);
      await user.update({
        password: hashnewpassword,
        where: { id },
      });
      return res.status(200).json({
        success: "Successfully change password",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: "Change Password Failed",
      });
    }
  },
  changeUsername: async (req, res) => {
    const { username } = req.user;
    try {
      const { oldusername, newusername } = req.body;
      const user = await getuser.findOne({
        where: {
          username: oldusername,
        },
      });
      if (username !== oldusername) {
        res.status(500).json({
          error: "Username Invalid",
        });
      }
      user.username = newusername;
      await user.save();

      const data = await fs.readFile(
        path.resolve(__dirname, "../emails/changeemail.html"),
        "utf-8"
      );
      const tesCompile = handlebars.compile(data);
      const tempResult = tesCompile({
        x: "username",
      });
      await transporter.sendMail({
        to: user.email,
        subject: "Username has changed",
        html: tempResult,
      });
      return res.status(200).json({
        success: "Change Username Success",
      });
    } catch (err) {
      return res.status(500).json({
        error: "Username Already Exist",
      });
    }
  },
  changePhone: async (req, res) => {
    try {
      const { oldphone, newphone } = req.body;
      const user = await getuser.findOne({
        where: {
          phone: oldphone,
        },
      });
      if (!user) {
        res.status(404).json({
          error: "oldphone invalid",
        });
      }
      user.phone = newphone;
      await user.save();
      const data = await fs.readFile(
        path.resolve(__dirname, "../emails/changeemail.html"),
        "utf-8"
      );
      const tesCompile = handlebars.compile(data);
      const tempResult = tesCompile({
        x: "Phone Number",
      });
      await transporter.sendMail({
        to: user.email,
        subject: "Phone has changed",
        html: tempResult,
      });
      return res.status(200).json({
        success: "Change Phone Success",
      });
    } catch (err) {
      res.status(500).json({
        error: "Phone Already Exist",
      });
    }
  },
  changeEmail: async (req, res) => {
    try {
      const { oldemail, newemail } = req.body;
      const user = await getuser.findOne({
        where: {
          email: oldemail,
        },
      });
      if (!user) {
        res.status(404).json({
          error: "oldemail invalid",
        });
      }
      user.email = newemail;
      await user.save();
      const data = await fs.readFile(
        path.resolve(__dirname, "../emails/changeemail.html"),
        "utf-8"
      );
      const tesCompile = handlebars.compile(data);
      const tempResult = tesCompile({
        x: "Email",
      });
      await transporter.sendMail({
        to: newemail,
        subject: "Email has changed",
        html: tempResult,
      });
      return res.status(200).json({
        success: "Change Email Success",
      });
    } catch (err) {
      res.status(500).json({
        error: "newemail already exist",
      });
    }
  },
  changeAvatar: async (req, res) => {
    try {
      const { id } = req.user;
      const oldavatar = await getuser.findOne({ where: { id } });
      if (oldavatar.imgProfile) {
        fs.unlink(oldavatar.imgProfile, (err) => {
          if (err) {
            return res.status(500).json({ message: "error" });
          }
        });
      }
      await db.sequelize.transaction(async (t) => {
        const result = await getuser.update(
          {
            imgProfile: req.file.path,
          },
          {
            where: {
              id,
            },
          },
          { transaction: t }
        );
        return res.status(200).json({
          message: "Change avatar success",
        });
      });
    } catch (error) {
      return res.status(500).json({
        message: "Change avatar failed",
      });
    }
  },
};
module.exports = changeController;
