// eslint-disable-next-line import/newline-after-import
const express = require("express");
const router = express.Router();
const auth = require("../midleWare/auth");
//import auth controller
const {
  createCashOrder,
  getOne,
  updateOrderTopaid,
  updateOrderTodelevred,
  checkOut,
  updateOrderStatus,
  getOrders,
  getUserOrders,
  getOrdersByStatus,
} = require("../controlers/orderController");
// router.use(authController.allowedTo("user"), authController.protect);
router.route("/:cartId").post(createCashOrder);
router.route("/:id").get(getOne);
router.route("/status/:status").get(getOrdersByStatus);
router.route("/user").get(getUserOrders);
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
router.post(
  "/checkout-session/:cartId",
  // authService.allowTo(),
  checkOut
);
router.get("/", auth.auth, getOrders);
router.put("/:id/status", updateOrderStatus);
module.exports = router;
