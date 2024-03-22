// eslint-disable-next-line import/newline-after-import
const express = require("express");
const app = express();
const {
  getCurrentUserShoppingCart,
  addBProductsToshoppingCart,
  updatProductInShoppingCart,
  deleteProductInShoppingCart,
  clearCart,
} = require("../controlers/shoppingCart");
// eslint-disable-next-line import/newline-after-import
const { auth } = require("../midleWare/auth");
const router = express.Router();

router.use(auth);
router.get("/", getCurrentUserShoppingCart);
router.post("/", addBProductsToshoppingCart);
router.patch("/update/:productId", updatProductInShoppingCart);
router.delete("/remove/:productId", deleteProductInShoppingCart);
router.delete("/clear", clearCart);
module.exports = router;
