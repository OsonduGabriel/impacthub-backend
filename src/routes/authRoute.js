import { Router } from "express";
import { register } from "../controllers/userController.js";
import { validateNewUser } from "../middleware/validationMiddleware.js";

const authRouter = Router();

authRouter.post("/register", validateNewUser, register);

export default authRouter;
