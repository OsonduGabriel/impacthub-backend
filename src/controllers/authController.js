import jwt from "jsonwebtoken";
import { AuthService } from "../services/authService.js";
const authService = new AuthService();
import crypto from "crypto";
import sendOTP from "../helpers/emailHelper.js";
import { error } from "console";
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
      message: "success",
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
      .json({ message: "success", data: { user: user, token: token } });
  } catch (error) {
    return res.status(400).json({ error: "Error", message: error.message });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await authService.confirmEmail(req.body);
    if (!user) {
      return res.status(404).json({
        error: "Error",
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
      console.log("got here");
      return res.json({
        status: "success",
        message: "Rest token sent to email",
      });
    } catch (error) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(500).json({
        error: "Error",
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
        .json({ error: "Error", message: "Invalid or Expired Token" });
    }
    // update user details
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    const newToken = generateToken(user.id);

    return res.status(201).json({ message: "success", token: newToken });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  console.log(req.body);
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await authService.getUserById(req.user.id);
    console.log(`here is user ${user.fullname}`);
    if (!user) {
      return res.status(400).json({ error: "Error", message: error.message });
    }
    const compare = await user.comparePassword(oldPassword);
    if (!compare) {
      return res.status(401).json({
        error: "Password Incorrect",
        message: "Enter Current Password",
      });
    }
    console.log("I hate when thing so south");
    user.password = newPassword;
    await user.save();
    return res
      .status(201)
      .json({ status: "success", message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};
