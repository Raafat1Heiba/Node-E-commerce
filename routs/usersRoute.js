// eslint-disable-next-line import/newline-after-import
const express = require("express");
const app = express();

const {
  createUser,
  getUserByEmail,
  getAllUsers,
  login,
} = require("../controlers/useresController");
const { auth } = require("../midleWare/auth");
// eslint-disable-next-line import/newline-after-import
const { isAdmin } = require("../midleWare/Admin");
const router = express.Router();
router.post("/register", createUser);
// router.get("/:id",getUserByEmail)
// router.get("/",getAllUsers)
router.post("/login", login);

module.exports = router;
