import { Router } from "express";
import { registerVolunteer } from "../controllers/volunteerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const volunteerRouter = Router();

volunteerRouter.post(
  "/volunteer/register",
  protect,
  authorize(["user", "platform-admin"]),
  registerVolunteer,
);

export default volunteerRouter;
