const { body, validationResult } = require("express-validator");

const registervalidator = [
  body("username").notEmpty().withMessage("username cannot be empty"),
  body("email").isEmail().withMessage(" is not email format"),
  body("phone").notEmpty().withMessage("phone cannot be empty"),
  body("phone").isMobilePhone().withMessage("is not phone format"),
  body("password").notEmpty().withMessage("password cannot be empty"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("password")
    .matches(/[A-Z]/)
    .withMessage("password must be at least one uppercase letter"),
  body("password")
    .matches(/[!@#$%^&*()\-_=+{};:'",.<>?]/)
    .withMessage("password must be at least one symbol"),
];
const usernamevalidator = [
  body("oldusername").notEmpty().withMessage("username cannot be empty"),
  body("newusername").notEmpty().withMessage("username cannot be empty"),
];

const passwordvalidator = [
  body("newpassword").notEmpty().withMessage("password cannot be empty"),
  body("newpassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("newpassword")
    .matches(/[A-Z]/)
    .withMessage("password must be at least one uppercase letter"),
  body("newpassword")
    .matches(/[!@#$%^&*()\-_=+{};:'",.<>?]/)
    .withMessage("password must be at least one symbol"),
  body("confirmpassword").notEmpty().withMessage("password cannot be empty"),
];

const phonevalidator = [
  body("newphone").isMobilePhone().withMessage("is not phone format"),
];

const emailvalidator = [
  body("oldemail").isEmail().withMessage(" is not email format"),
  body("newemail").isEmail().withMessage(" is not email format"),
];

const createblogvalidator = [
  body("title")
    .isLength({ max: 150 })
    .withMessage("title maximal size 150 character"),
  body("content")
    .isLength({ max: 500 })
    .withMessage("content maximal sixe 500 character"),
];
const resultvalidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty() == false) {
    return res.status(500).json({
      errors: errors.array(),
    });
  }
  next();
};
module.exports = {
  registervalidator,
  resultvalidation,
  usernamevalidator,
  phonevalidator,
  passwordvalidator,
  emailvalidator,
  createblogvalidator,
};
