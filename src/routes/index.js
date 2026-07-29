import express from "express";

import authRoutes from "./authRoute.js";
import userRoutes from "./userRoute.js";
import ngoRoutes from "./ngoRoute.js";
import opportunityRoutes from "./opportunityRoute.js";
import certificateRoutes from "./certificateRoute.js";
import impactProfileRoutes from "./impactProfileRoute.js";
import notificationRoutes from "./notificationRoute.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/ngos", ngoRoutes);

router.use("/opportunities", opportunityRoutes);

router.use("/certificates", certificateRoutes);

router.use("/impact-profile", impactProfileRoutes);

router.use("/notifications", notificationRoutes);

export default router;