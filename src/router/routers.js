const { verifyToken } = require("../../middleware/auth");
const { multerUpload } = require("../../middleware/multer");
const {
  registervalidator,
  resultvalidation,
  phonevalidator,
  usernamevalidator,
  passwordvalidator,
  emailvalidator,
  createblogvalidator,
} = require("../../middleware/validator");
const {
  getAccount,
  authController,
  changeController,
  createBlog,
  createCategory,
  createCountry,
} = require("../controller");
const express = require("express");
const passwordController = require("../controller/passwordController");
const router = express.Router();

router.post(
  "/registrasi",
  registervalidator,
  resultvalidation,
  authController.register
);
router.post("/login", authController.login);
router.get("/getbyid/:id", getAccount.getbyId);
router.get("/getalluser", getAccount.getAll);
router.patch(
  "/change-password",
  verifyToken,
  passwordvalidator,
  resultvalidation,
  changeController.changePassword
);
router.patch(
  "/change-username",
  verifyToken,
  usernamevalidator,
  resultvalidation,
  changeController.changeUsername
);
router.patch(
  "/change-phone",
  verifyToken,
  phonevalidator,
  resultvalidation,
  changeController.changePhone
);
router.patch(
  "/change-email",
  verifyToken,
  emailvalidator,
  resultvalidation,
  changeController.changeEmail
);
router.patch(
  "/change-avatar",
  verifyToken,
  multerUpload.single("avatar"),
  changeController.changeAvatar
);
router.post(
  "/create-blog",
  verifyToken,
  multerUpload.single("imgBlog"),
  createblogvalidator,
  resultvalidation,
  createBlog.createBlog
);
router.post("/create-category", createCategory.inputCategory);
router.get("/get-allcategory", createCategory.getAllCategory);
router.post("/create-country", createCountry.createCountry);
router.get("/get-allcountry", createCountry.getAllcountry);
router.get("/get-allblog", createBlog.getAllblog);
router.put("/forgot-password", passwordController.forgotPassword);
router.patch(
  "/reset-password",
  verifyToken,
  passwordvalidator,
  resultvalidation,
  passwordController.resetPassword
);
router.patch("/verification", verifyToken, authController.statusverified);
module.exports = router;
