"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: "userId" });
      this.belongsTo(models.country, { foreignKey: "countryId" });
      this.belongsTo(models.category, { foreignKey: "categoryId" });
    }
  }
  blog.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      keyword: DataTypes.STRING,
      imgBlog: DataTypes.STRING,
      vidioUrl: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      countryId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "blog",
    }
  );
  return blog;
};
