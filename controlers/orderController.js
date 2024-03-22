/* eslint-disable import/no-extraneous-dependencies */
const stripe = require("stripe")(process.env.STRIPE_KEY);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/error");
const Order = require("../models/orderModel");
//impot cart model
//import product model

exports.createCashOrder = asyncHandler(async (req, res) => {
  const taxPrice = 0;
  const shiippingPrice = 0;
  // GET cart depend on cartid
  const cart = Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no cart with this id ${req.params.cartId} `, 404)
    );
  }
  // GET order price depend on cart price "check if copon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCreatePrice;
  const totalOrderPrice = cartPrice + taxPrice + shiippingPrice;
  // CRETE order with payment
  const order = await Order.create({
    user: req.user._id,
    cartItem: cart.cartItems,
    shiipingAdress: req.body.shiipingAdress,
    totalOrderPrice,
  });
  //after create order decrement product , increment product
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        fillter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Prouduct.bulkWrite(bulkOption, {});
    // clear cart depend on cartid
    await Cart.findByIdAndDelete(req.params.create);
  }
  res.status(201).json({ status: "success" });
});
exports.fillterOrdersForLogged = asyncHandler(async (req, res) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
});
exports.getOne = asyncHandler(async (req, res, next) => {
  const { id } = req.params.id;
  const order = await Order.findById(id);
  if (!order) {
    return next(new ApiError("Category not found", 404));
    //  return res.status(400).json({ msg: "order not found" });
  }
  res.status(200).json({ data: order });
});
// exports.getAll = asyncHandler(async (req, res, next) => {});
exports.updateOrderTopaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order Not Found", 404));
  }
  // update order to paid
  order.isPaid = true;
  order.paid = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});
exports.updateOrderTodelevred = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order Not Found", 404));
  }
  // update order to paid
  order.isDelevered = true;
  order.delveredAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});
exports.checkOut = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shiippingPrice = 0;
  const cart = Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no cart with this id ${req.params.cartId} `, 404)
    );
  }
  // GET order price depend on cart price "check if copon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCreatePrice;
  const totalOrderPrice = cartPrice + taxPrice + shiippingPrice;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        name: req.user.name,
        amount: totalOrderPrice * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    clien_reference_id: req.params.cartId,
    metadata: req.body.shiipingAdress,
  });
  //send session to res
  res.status(200).json({ status: "succes", session });
});
