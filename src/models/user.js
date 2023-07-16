"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.blog, { foreignKey: "userId" });
    }
  }
  user.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      password: DataTypes.STRING,
      isVerified: {
        defaultValue: false,
        type: DataTypes.STRING,
      },
      imgProfile: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  user.prototype.hashPassword = async function (password) {
    const salt = 10;
    return await bcrypt.hash(password, salt);
  };
  user.prototype.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  // user.prototype.verifyUsername = async function (username) {
  //   return await bcrypt.compare(username, this.username);
  // };
  return user;
};
