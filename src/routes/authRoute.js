import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  registerAdmin,
  registerNgoAdmin,
} from "../controllers/authController.js";
import {
  validateNewUser,
  validateCurrentUser,
  validatePassword,
  validateChangePassword,
} from "../middleware/validationMiddleware.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

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

authRouter.put("/admin/register", protect, authorize("user"), registerAdmin);

authRouter.put(
  "/Ngo-admin/register",
  protect,
  authorize("user"),
  registerNgoAdmin,
);
export default authRouter;
