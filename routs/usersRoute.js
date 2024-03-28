const express = require("express");
const app = express();

<<<<<<< HEAD
=======
const {
  createUser,
  getUserByEmail,
  getAllUsers,
  login,
  uploadUserImage,
  resizeImage
} = require("../controlers/useresController");
//const main = require("../controlers/useresController");

>>>>>>> 201440c5f48905ceaede704437c7e11917c8932c
const { auth } = require("../midleWare/auth");
const { isAdmin } = require("../midleWare/Admin");
const main = require("../controlers/useresController");
const router = express.Router();
<<<<<<< HEAD

router.post(
  "/register",
  main.resizeImage,
  main.uploadUserImage,
  main.createUser
);

router.post("/login", main.login);
=======
router.post("/register",
uploadUserImage,
resizeImage,
 createUser);
// router.get("/:id",getUserByEmail)
// router.get("/",getAllUsers)
router.post("/login", login);
>>>>>>> 201440c5f48905ceaede704437c7e11917c8932c

module.exports = router;
