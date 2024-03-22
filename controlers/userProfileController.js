const User = require("../models/userModel");
const { findUserByEmail } = require("../services/userService");
// eslint-disable-next-line import/no-extraneous-dependencies, import/order
const bcrypt = require("bcrypt");
const { validateUser } = require("../utils/validators/usersValidator");

const getCurrentUserProfile = async (req, res) => {
  try {
    // const  email = req.headers.email;

    // if(!email){
    //     return res.status(404).send("current user email is required!");
    // }
    // eslint-disable-next-line prefer-destructuring
    const user = req.user;
    if (!user) {
      return res.status(404).send("incorrect email");
    }

    res.send(user);
  } catch (error) {
    //return res.status(404).send("Invalid request");
    console.log(error.message);
  }
};

const updateCurrentUserProfile = async (req, res) => {
  try {
    const { error, value } = validateUser(req.body);
    if (error) {
      res.status(400).send({ message: "Invalid form field.." });
      return;
    }
    // const  email  = req.headers["email"];

    // eslint-disable-next-line prefer-destructuring
    const user = req.user;
    if (!user) {
      return res.status(404).send("incorrect email");
    }

    if (value.password) {
      const passwordHash = await bcrypt.hash(value.password, 10);
      await User.updateOne({ email }, { passwordHash });
    }

    await User.updateOne({ email: user.email }, req.body);
    const updatedUser = await findUserByEmail(user.email);
    res.send(updatedUser);
  } catch (error) {
    // eslint-disable-next-line prefer-template
    res.status(404).send("Invalid request" + error.message);
    // eslint-disable-next-line no-useless-return
    return;
  }
};

module.exports = {
  getCurrentUserProfile,
  updateCurrentUserProfile,
};
