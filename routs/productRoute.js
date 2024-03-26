const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");
const { isAdmin } = require("../midleWare/Admin");
const router = express.Router({ mergeParams: true });
const main = require("../controlers/productController");
router.get("/", main.get);
router.get("/:id", getProductValidator, main.getId);
router.post(
  "/",
  // main.uploadProductImage,
  // main.resizeImage,
  createProductValidator,
  main.create
);
router.put("/:id", updateProductValidator, main.update);
router.delete("/:id", deleteProductValidator, main.delete);
module.exports = router;
