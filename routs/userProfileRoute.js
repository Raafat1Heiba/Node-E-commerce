// eslint-disable-next-line import/newline-after-import
const express = require("express");
const router = express.Router();

const controllers = require("../controlers/userProfileController");
const { auth } = require("../midleWare/auth");
//const { isAdmin } = require("../middleware/admin");

router.get(
  "/",
  auth,

  controllers.getCurrentUserProfile
);
router.patch(
  "/",
  auth,
  // controllers.resizeImage,
  // controllers.uploadUserImage,
  controllers.updateCurrentUserProfile
);
router.patch(
  "/password",
  // controllers.resizeImage,
  // controllers.uploadUserImage,
  controllers.updatePassword
);

module.exports = router;
