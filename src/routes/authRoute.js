import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/authController.js";
import {
  validateNewUser,
  validateCurrentUser,
  validatePassword,
  validateChangePassword,
} from "../middleware/validationMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", validateNewUser, register);
authRouter.post("/login", validateCurrentUser, login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", validatePassword, resetPassword);
authRouter.post(
  "/change-password",
  protect,
  validateChangePassword,
  changePassword,
);
export default authRouter;
