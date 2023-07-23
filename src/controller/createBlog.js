const db = require("../models");
const user = db.user;
const blog = db.blog;
const category = db.category;

const createblogController = {
  createBlog: async (req, res) => {
    const { title, content, keyword, vidioUrl, countryId, categoryId } =
      req.body;
    try {
      await db.sequelize.transaction(async (t) => {
        const createarticle = await blog.create(
          {
            title,
            content,
            keyword,
            imgBlog: req.file.path,
            vidioUrl,
            userId: req.user.id,
            countryId,
            categoryId,
          },
          { transaction: t }
        );
        return res.status(200).json({
          success: "create blog success",
          data: createarticle,
        });
      });
    } catch (err) {
      return res.status(500).json({
        error: "create blog failed",
        status: err.message,
      });
    }
  },
  getAllblog: async (req, res) => {
    try {
      const pagenumber = parseInt(req.query.page) || 1;
      const pagesize = parseInt(req.query.size) || 10;
      const categoryId = req.query.id_cat;
      const whereCategory = categoryId ? { id: categoryId } : {};
      const offset = (pagenumber - 1) * pagesize;
      const sortBy = req.query.sortBy || "DESC";
      const data = await blog.findAll({
        attributes: [
          "id",
          "title",
          "content",
          "keyword",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: category,
            where: whereCategory,
            attributes: ["name"],
          },
          {
            model: user,
            attributes: ["id", "username", "email"],
          },
        ],
        limit: pagesize,
        offset: offset,
        order: [["createdAt", sortBy]],
      });
      // console.log(data);
      return res.status(200).json({
        succes: "Get Blog Success",
        data,
      });
    } catch (err) {
      res.status(500).json({
        error: "get blog failed",
      });
    }
  },
};
module.exports = createblogController;
