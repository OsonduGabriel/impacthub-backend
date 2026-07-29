import { Router } from "express";
const certificationRouter = Router();
import {
  addCertification,
  updateCertification,
  getCertification,
  getAllCertification,
  deleteCertification,
} from "../controllers/certificationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  validateCertification,
  validateUpdateCertification,
} from "../middleware/validationMiddleware.js";

certificationRouter.post(
  "/certification/register",
  protect,
  authorize("volunteer"),
  validateCertification,
  addCertification,
);

certificationRouter.put(
  "/certification/update/:id",
  protect,
  authorize("volunteer"),
  validateUpdateCertification,
  updateCertification,
);

certificationRouter.get(
  "/certifications",
  protect,
  authorize("volunteer"),
  getAllCertification,
);

certificationRouter.get(
  "/certification/:id",
  protect,
  authorize("volunteer"),
  getCertification,
);

certificationRouter.delete(
  "/certification/delete/:id",
  protect,
  authorize("volunteer"),
  deleteCertification,
);

export default certificationRouter;
