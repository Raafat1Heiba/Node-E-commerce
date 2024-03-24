const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
  // eslint-disable-next-line import/newline-after-import
} = require("../utils/validators/productValidator");
const { isAdmin } = require("../midleWare/Admin");
const router = express.Router();
const main = require("../controlers/productController");
// eslint-disable-next-line import/no-useless-path-segments, import/newline-after-import
router.get("/", isAdmin,main.get);
router.get("/:id", getProductValidator, main.getId);
router.post("/", createProductValidator, main.create);
router.put("/:id", updateProductValidator, main.update);
router.delete("/:id", deleteProductValidator, main.delete);
module.exports = router;
