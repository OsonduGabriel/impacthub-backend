import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "Error, Not authorized to access this route",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // decode to get user details from token.
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({
          status: "failed",
          message: "Error, User no Longer Exists",
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          status: "failed",
          message: "Error, User account is deactivated",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        status: "failed",
        message: "Error, Token is invalid or expired",
        error: error.message,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "failed",
        message: `Error, role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
