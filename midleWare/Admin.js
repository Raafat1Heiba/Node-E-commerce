const isAdmin = (req, res, next) => {
  try {
    // if (!req.user || !req.user.isAdmin) {

    //     return res.status(403).send({ message: "Forbidden - Admin access required" });
    // }
    // eslint-disable-next-line prefer-destructuring, dot-notation
    const role = req.headers["role"];
    if (role !== "admin") {
      return res
        .status(403)
        .send({ message: "Forbidden - Admin access required" });
    }

    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized user" });
  }
};

module.exports = { isAdmin };
