import jwt from "jsonwebtoken";
import { AuthService } from "../services/authService.js";
const authService = new AuthService();
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};
export const register = async (req, res) => {
  try {
    const user = await authService.createUser(req.body);
    const token = generateToken(user.id);
    return res
      .status(201)
      .json({ message: "success", data: { user: user, token: token } });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding user", error: error.message });
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
    return res.status(401).json({
      message: "Error, Invalid email or password",
      error: error.message,
    });
  }
};
