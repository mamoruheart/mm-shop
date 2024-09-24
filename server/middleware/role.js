const check =
  (...roles) =>
  (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).send("Unauthorized");
      }

      const hasRole = roles.find((role) => req.user.role === role);
      if (!hasRole) {
        return res
          .status(403)
          .send("You are not allowed to make this request.");
      }

      next();
    } catch (err) {
      console.error("check role:", err?.message);
      next(err);
    }
  };

const role = { check };

module.exports = role;
