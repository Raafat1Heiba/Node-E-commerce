// eslint-disable-next-line import/newline-after-import
const express = require("express");
const router = express.Router();
//import auth controller
const {
  createCashOrder,
  getOne,
  updateOrderTopaid,
  updateOrderTodelevred,
  checkOut,
} = require("../controlers/orderController");
// router.use(authController.allowedTo("user"), authController.protect);
router.route("/:cartId").post(createCashOrder);
router.route("/:cartId").get(getOne);
router.put(
  "/:id/pay",
  // authService.allowTo("admin", "manager"),
  updateOrderTopaid
);
router.put(
  "/:id/delever",
  // authService.allowTo("admin", "manager"),
  updateOrderTodelevred
);
router.get(
  "checkout-session/:cartId",
  // authService.allowTo(),
  checkOut
);
module.exports = router;