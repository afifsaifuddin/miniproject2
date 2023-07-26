const db = require("../models");
const user = db.user;
const blog = db.blog;
const country = db.country;
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
        return res
          .status(200)
          .json({ success: "Success", data: createarticle });
      });
    } catch (err) {
      return res.status(500).json({ error: "Failed" });
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
        attributes: { exclude: ["userId", "categoryId", "countryId"] },
        include: [
          { model: country, attributes: ["id", "name"] },
          { model: category, attributes: ["id", "name"] },
          { model: user, attributes: ["id", "username", "email"] },
        ],
        limit: pagesize,
        offset: offset,
        order: [["createdAt", sortBy]],
      });
      return res.status(200).json({ succes: "Success", data });
    } catch (err) {
      res.status(500).json({ error: "Failed" });
    }
  },
};
module.exports = createblogController;
