import { Router } from "express";
import {
  createNewUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  validateNewUser,
  validateUpdateUser,
} from "../middleware/validationMiddleware.js";

const userRouter = Router();

userRouter.post(
  "/create-user",
  protect,
  authorize("platform-admin"),
  validateNewUser,
  createNewUser,
);

userRouter.post(
  "/update-user/:id",
  protect,
  authorize("platform-admin"),
  validateUpdateUser,
  updateUser,
);

userRouter.get("/all-users", protect, authorize("platform-admin"), getAllUsers);

userRouter.get("/user/:id", protect, authorize("platform-admin"), getUser);

userRouter.delete(
  "/delete-user/:id",
  protect,
  authorize("platform-admin"),
  deleteUser,
);

export default userRouter;
