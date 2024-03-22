const express = require("express");
const {
  getcategoryValidator,
  createcategoryValidator,
  updatecategoryValidator,
  deletecategoryValidator,
  // eslint-disable-next-line import/newline-after-import
} = require("../utils/validators/categoryValidator");
const router = express.Router();
const main = require("../controlers/controller");
// eslint-disable-next-line import/no-useless-path-segments, import/newline-after-import
const subcategoryRoute = require("../routs/subCategoryRoute");

router.use("/:categoryId/subcategories", subcategoryRoute);
router.get("/", main.get);
router.get("/:id", getcategoryValidator, main.getId);
router.post(
  "/",
  main.uploadCategoryImage,
  main.resizeImage,
  createcategoryValidator,
  main.create
);
router.put(
  "/:id",
  main.uploadCategoryImage,
  main.resizeImage,
  updatecategoryValidator,
  main.update
);
router.delete("/:id", deletecategoryValidator, main.delete);
module.exports = router;
