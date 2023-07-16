const express = require("express");
const db = require("../models");
const getuser = db.user;

const changeController = {
  changePassword: async (req, res) => {
    const { username, oldpassword, newpassword } = req.body;
    try {
      const User = await getuser.findOne({
        where: {
          username,
        },
      });
      if (!User) {
        return res.status(404).json({
          error: "Account not Found",
        });
      }
      if (!User.verifyPassword(oldpassword)) {
        return res.status(500).json({
          error: "Invalid old password",
        });
      }
      User.password = await User.hashPassword(newpassword);
      await User.save();
      return res.status(200).json({
        success: "Successfully change password",
      });
    } catch (err) {
      //   console.log(err);
      return res.status(500).json({
        error: "Change Password Failed",
      });
    }
  },
  changeUsername: async (req, res) => {
    try {
      await db.sequelize.transaction(async (t) => {
        const { oldusername, newusername } = req.body;
        const user = await getuser.findOne({
          where: {
            username: oldusername,
          },
        });
        const userall = await getuser.findOne({
          where: {
            username: newusername,
          },
        });
        console.log(user);
        if (userall) {
          res.status(404).json({
            error: "newusername already exist",
          });
        }
        user.username = newusername;
        await user.save({ transaction: t });
        return res.status(200).json({
          success: "Change Username Success",
        });
      });
    } catch (err) {
      //   console.log(err);
      res.status(500).json({
        error: "Change Username Failed",
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
      return res.status(200).json({
        success: "Change Phone Success",
      });
    } catch (err) {
      res.status(500).json({
        error: "Change Phone Failed",
      });
    }
  },
};
module.exports = changeController;
