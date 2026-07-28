import { Router } from "express";
import {
  registerVolunteer,
  updateVolunteer,
} from "../controllers/volunteerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateUpdateVolunteer } from "../middleware/validationMiddleware.js";
import uploadProfileFiles from "../config/multer.js";

const volunteerRouter = Router();

volunteerRouter.post(
  "/volunteer/register",
  protect,
  authorize("user", "platform-admin"),
  registerVolunteer,
);

volunteerRouter.put(
  "/volunteer/update",
  protect,
  authorize("volunteer"),
  uploadProfileFiles,
  validateUpdateVolunteer,
  updateVolunteer,
);

export default volunteerRouter;
