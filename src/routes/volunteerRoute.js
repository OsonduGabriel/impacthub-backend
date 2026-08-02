import { Router } from "express";
import {
  registerVolunteer,
  updateVolunteer,
  getVolunteer,
  getAllVolunteers,
  deleteVolunteer,
} from "../controllers/volunteerController.js";
import {
  protect,
  authorize,
  closeProtect,
} from "../middleware/authMiddleware.js";
import { validateUpdateVolunteer } from "../middleware/validationMiddleware.js";
import uploadProfileFiles from "../config/multer.js";

const volunteerRouter = Router();

volunteerRouter.post(
  "/volunteer/register",
  closeProtect,
  authorize("user"),
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

volunteerRouter.get(
  "/volunteer",
  protect,
  authorize("volunteer"),
  getVolunteer,
);

volunteerRouter.get(
  "/volunteers",
  protect,
  authorize("platform-admin"),
  getAllVolunteers,
);

volunteerRouter.delete(
  "/volunteer/delete",
  protect,
  authorize("volunteer"),
  deleteVolunteer,
);

export default volunteerRouter;