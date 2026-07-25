import { Router } from "express";
import { registerVolunteer } from "../controllers/volunteerController.js";
import { protect } from "../middleware/authMiddleware.js";

const volunteerRouter = Router();

volunteerRouter.post("/volunteer/register", protect, registerVolunteer);

export default volunteerRouter;
