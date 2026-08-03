import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  registerAdmin,
  registerNgoAdmin,
  logout,
} from "../controllers/authController.js";
import {
  validateNewUser,
  validateCurrentUser,
  validatePassword,
  validateChangePassword,
} from "../middleware/validationMiddleware.js";
import {
  protect,
  authorize,
  closeProtect,
} from "../middleware/authMiddleware.js";

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

authRouter.put(
  "/admin/register",
  closeProtect,
  authorize("user"),
  registerAdmin,
);

authRouter.put(
  "/Ngo-admin/register",
  closeProtect,
  authorize("user"),
  registerNgoAdmin,
);

authRouter.post("/logout", protect, logout);
export default authRouter;
