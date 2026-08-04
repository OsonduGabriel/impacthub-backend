import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import { AuthService } from "../services/authService.js";

import crypto from "crypto";
import sendOTP from "../helpers/emailHelper.js";
import { error } from "console";
const authService = new AuthService();

//
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};
const generateOTP = (length = 6) => {
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10);
  }
  return otp;
};
export const register = async (req, res, next) => {
  try {
    const user = await authService.createUser(req.body);
    const token = generateToken(user.id);
    return res.status(201).json({
      status: "success",
      data: { user: user, token: token },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res) => {
  try {
    console.log(req.body);
    const user = await authService.loginUser(req.body);
    const token = generateToken(user.id);
    return res
      .status(200)
      .json({ status: "success", data: { user: user, token: token } });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await authService.confirmEmail(req.body);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: error.message,
      });
    }

    // Generate reset token
    const restToken = generateOTP();

    // Hash and send to database
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(restToken)
      .digest("hex");

    // add expiry time
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10mins * 60 sec * 1000 ms = 600000ms
    await user.save();

    try {
      await sendOTP(user.email, restToken);
      return res.json({
        status: "success",
        message: "Rest token sent to email",
      });
    } catch (error) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(500).json({
        status: "failed",
        message: "Error sending email. Please try again later",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token to match database record
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // find user by token
    const user = await authService.getUserByResetPassword(resetPasswordToken);
    if (!user) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid or Expired Token" });
    }
    // update user details
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    const newToken = generateToken(user.id);

    return res.status(201).json({ status: "success", token: newToken });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await authService.getUserById(req.user.id);
    if (!user) {
      return res.status(400).json({ status: "failed", message: error.message });
    }
    const compare = await user.comparePassword(oldPassword);
    if (!compare) {
      return res.status(401).json({
        status: "failed",
        error: "Password Incorrect",
        message: "Enter Current Password",
      });
    }

    user.password = newPassword;
    await user.save();
    return res
      .status(201)
      .json({ status: "success", message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

export const registerAdmin = async (req, res, next) => {
  try {
    const user = await authService.createAdmin(req.user);
    return res.status(201).json({
      status: "success",
      message: "Platform Admin created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const registerNgoAdmin = async (req, res, next) => {
  try {
    const user = await authService.createNgoAdmin(req.user);
    return res.status(201).json({
      status: "success",
      message: "NGO Admin created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // decode to get user details from token.
    const currentTime = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp - currentTime;
    if (ttl > 0) {
      await redisClient.setEx(`blackList_${token}`, ttl, "revoked");
    }
    res.status(200).json({
      status: "success",
      message: "logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
