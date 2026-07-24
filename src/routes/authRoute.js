import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import {
  validateNewUser,
  validateCurrentUser,
} from "../middleware/validationMiddleware.js";

const authRouter = Router();

authRouter.post("/register", validateNewUser, register);
authRouter.post("/login", validateCurrentUser, login);

export default authRouter;
