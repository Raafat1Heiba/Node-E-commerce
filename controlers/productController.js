const slugify = require("slugify");
const product = require("../models/productModel");
const ApiError = require("../utils/error");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const sharp = require("sharp");
const { emit } = require("nodemon");
const { v4: uuidv4 } = require("uuid");

const multerStorage = multer.memoryStorage();
const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("only images", 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadProductImage = upload.fields([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);
exports.resizeImage = asyncHandler(async (req, res, next) => {
  console.log(req.files);
  if (!req.files.imageCover) {
    return next(
      new ApiError("No file uploaded or file buffer is missing", 400)
    );
  }
  const filename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/categories/${filename}`);
  // // Save image into our db
  req.body.imageCover = filename;
  next();
});
exports.get = asyncHandler(async (req, res) => {
  console.log(req.params.categoryId);
  let filterObj = {};
  if (req.params.categoryId) filterObj = { category: req.params.categoryId };
  const queryStringObj = { ...req.query, ...filterObj };
  const excludesFildes = ["page", "sort", "limit", "fields"];
  excludesFildes.forEach((field) => delete queryStringObj[field]);
  let queryStr = JSON.stringify(queryStringObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  //pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;
  const endIndex = page * limit;
  const pagination = {};
  const documentCount = await product.countDocuments();
  pagination.currentPage = page;
  pagination.limit = limit;
  pagination.numberPages = Math.ceil(documentCount / limit);
  //next page
  if (endIndex < documentCount) {
    pagination.nextPage = page + 1;
  }
  if (skip > 0) {
    pagination.prevPage = page - 1;
  }
  const paginationResult = pagination;
  //build query
  let mongooseQuery = product
    .find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name" });
  //sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort("-createAt");
  }
  //fields
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery.select("-__v");
  }
  //search
  if (req.query.keyword) {
    let query = {};
    if (product.modelName === "Product") {
      query.$or = [
        { title: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } },
      ];
    } else {
      query = { name: { $regex: req.query.keyword, $options: "i" } };
    }
    mongooseQuery = product.find(query);
  }
  //excute
  const products = await mongooseQuery;
  res
    .status(200)
    .json({ results: products.length, paginationResult, data: products });
});
exports.getId = asyncHandler(async (req, res, next) => {
  // eslint-disable-next-line prefer-destructuring
  const id = req.params.id;
  const products = await product
    .findById(id)
    .populate({ path: "category", select: "name" });
  if (!products) {
    return next(new ApiError("products not found", 404));
    //  return res.status(400).json({ msg: "Category not found" });
  }
  res.status(200).json({ data: products });
});
exports.update = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const products = await product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!products) {
    return next(new ApiError("products not found", 404));
  }
  // return res.status(400).json({ msg: "Category not found" });
  res.status(200).json(products);
});
exports.delete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const products = await product.findOneAndDelete(id);
  if (!products) {
    return next(new ApiError("products not found", 404));
  }
  // return res.status(400).json({ msg: "Category not found" });
  res.status(200).send();
});
exports.create = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const products = await product.create(req.body);
  res.status(201).json({ data: products });
});
