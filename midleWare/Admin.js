const isAdmin = (req, res, next) => {
  try {
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

module.exports = isAdmin;
