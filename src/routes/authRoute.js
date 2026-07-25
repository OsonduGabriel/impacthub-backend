import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import {
  validateNewUser,
  validateCurrentUser,
  validatePassword,
} from "../middleware/validationMiddleware.js";

const authRouter = Router();

authRouter.post("/register", validateNewUser, register);
authRouter.post("/login", validateCurrentUser, login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", validatePassword, resetPassword);
export default authRouter;
