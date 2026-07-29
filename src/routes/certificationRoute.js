import { Router } from "express";
const certificationRouter = Router();
import { addCertification } from "../controllers/certificationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateCertification } from "../middleware/validationMiddleware.js";

certificationRouter.post(
  "/certification/register",
  protect,
  authorize("volunteer"),
  validateCertification,
  addCertification,
);

export default certificationRouter;
