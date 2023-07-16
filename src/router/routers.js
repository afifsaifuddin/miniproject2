const {
  getAccount,
  authController,
  changeController,
} = require("../controller");
const express = require("express");
const router = express.Router();

router.get("/getbyid/:id", getAccount.getbyId);
router.post("/login", authController.login);
router.post("/registrasi", authController.register);
router.post("/change-password", changeController.changePassword);
router.patch("/change-username", changeController.changeUsername);
router.post("/change-phone", changeController.changePhone);
module.exports = router;
