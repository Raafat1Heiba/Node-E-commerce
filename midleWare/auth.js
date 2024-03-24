const jwt = require("jsonwebtoken");
<<<<<<< HEAD
=======
const User = require("../models/userModel");

// eslint-disable-next-line import/newline-after-import
>>>>>>> 51bbdcd56266de8c3399632244bf0df7697bd8ef
const { findUserByEmail } = require("../services/userService");
const auth = async (req, res, next) => {
  try {
    // eslint-disable-next-line dot-notation
    const token = req.headers["jwt"];
    if (!token) {
      return res.status(401).send({ message: "unauthorized user" });
    }
    const payload = jwt.verify(token, "jwtSecret");
    const { id } = payload;
    const user = await User.findOne(id);
    if (!user) {
      return res.status(401).send({ message: "unauthorized user" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};
module.exports = { auth };
