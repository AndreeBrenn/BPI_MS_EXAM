const express = require("express");
const {
  create_user,
  login_user,
  refreshToken,
  logout_user,
  ReadEmployee,
  edit_user,
  delete_user,
} = require("../controller/EmployeeController");
const router = express.Router();
const multer = require("multer");
const savedImages = multer({ dest: "./savedImages" });
const savedImages1 = multer({ dest: "./savedImages" });

const { protected } = require("../middleware/protect");

router.post("/create-user", savedImages.single("image"), create_user);
router.post("/login-user", login_user);
router.get("/logout-user", logout_user);
router.post("/edit-user", savedImages1.single("image"), edit_user);
router.delete("/delete-user/:ID", protected, delete_user);

// EMPLOYEE
router.get("/get-employee/:offset/:limit/:search", protected, ReadEmployee);

// REFRESH TOKEN
router.get("/refresh", refreshToken);

module.exports = router;
