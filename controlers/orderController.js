const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/error");
const Order = require("../models/orderModel");
const Cart = require("../models/shoppingModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const stripe = require("stripe")(process.env.STRIPE_KEY);

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  try {
    const taxPrice = 0;
    const shiippingPrice = 0;
    // GET cart depend on cartid
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return next(
        new ApiError(`There is no cart with this id ${req.params.cartId} `, 404)
      );
      return console.log("error");
    }
    // GET order price depend on cart price "check if copon apply"
    const cartPrice = cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.price;
    const totalOrderPrice = cartPrice + taxPrice + shiippingPrice;

    // CRETE order with payment
    const order = await Order.create({
      user: cart.user,
      cartItems: cart.items,
      shiipingAdress: req.body.shiipingAdress,
      totalOrderPrice,
    });

    //after create order decrement product , increment product
    if (order) {
      const bulkOption = cart.items.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      }));
      await Product.bulkWrite(bulkOption, {});
      // clear cart depend on cartid
      await Cart.findByIdAndDelete(req.params.cartId);
    }
    res.status(201).json({ status: "success", data: order });
  } catch (error) {
    return next(
      new ApiError(`There is no cart with this id ${req.params.cartId} `, 404)
    );
  }
});

exports.getOne = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id).populate("user").populate({  path: 'cartItems', populate: { path: ' productId',  model: 'Product' } });
    if (!order) {
      return next(new ApiError("order not found", 404));
      //return res.status(400).json({ msg: "Category not found" });
    }
    res.status(200).json({ data: order });
  } catch (error) {
    console.log(error.message);

    return next(new ApiError("order not found", 404));
  }
});

exports.getOrders = asyncHandler(async (req, res) => {
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 5;
  // const skip = (page - 1) * limit;
  const orders = await Order.find().populate("user").populate({  path: 'cartItems', populate: { path: ' productId',  model: 'Product' } });

  res.status(200).json({ results: orders.length, data: orders });
});

exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById({ _id: id });
  if (!order) {
    return next(new ApiError("order not found", 404));
  }
  await Order.deleteOne({ _id: id });

  // return res.status(400).json({ msg: "Category not found" });
  res.status(200).json({ data: order });
});

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
  // update order to delvered
  order.isDelevered = true;
  order.delveredAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

exports.checkOut = asyncHandler(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}, 404`)
    );
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.price;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  const user = await User.findById(cart.user);

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          product_data: { name: "jjjjjjj", description: "jjjjjj" },
          unit_amount: totalOrderPrice * 100,
          currency: "egp",
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: ` ${req.protocol}://${req.get("host")}/cart`,
    customer_email: user.email,
    client_reference_id: req.params.cartId,
    // metadata: "jjjjjjj",
  });

  // 4) send session to response
  res.status(200).json({ status: "success", session });
});
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order Not Found", 404));
  }
  // update order to delvered
  order.status = status;
  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});
exports.getUserOrders = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const orders = await Order.find({ user: id }).populate({  path: 'cartItems', populate: { path: ' productId',  model: 'Product' } });
    if (!orders) {
      return next(new ApiError("order not found", 404));
      //return res.status(400).json({ msg: "Category not found" });
    }
    res.status(200).json({ data: orders });
  } catch (error) {
    console.log(error.message);

    return next(new ApiError("order not found", 404));
  }
});
exports.getOrdersByStatus = asyncHandler(async (req, res, next) => {
  try {
    const status = req.params.status;
    const orders = await Order.find({ status: status }).populate("user").populate({  path: 'cartItems', populate: { path: ' productId',  model: 'Product' } });
    if (!orders) {
      return next(new ApiError("order not found", 404));
      //return res.status(400).json({ msg: "Category not found" });
    }
    res.status(200).json({ data: orders });
  } catch (error) {
    console.log(error.message);

    return next(new ApiError("order not found", 404));
  }
});
