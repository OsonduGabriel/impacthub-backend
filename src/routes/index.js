import express from "express";

import authRoutes from "./authRoute.js";
import userRoutes from "./userRoute.js";
import volunteerRoutes from "./volunteerRoute.js";
import ngoRoutes from "./ngoRoute.js";
import opportunityRoutes from "./opportunityRoute.js";
import applicationRoutes from "./applicationRoute.js";
import certificateRoutes from "./certificateRoute.js";
import certificationRoutes from "./certificationRoute.js";
import impactProfileRoutes from "./impactProfileRoute.js";
import notificationRoutes from "./notificationRoute.js";
import reportRoutes from "./reportRoute.js";
import contributionRoutes from "./contributionRoute.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/", volunteerRoutes);

router.use("/ngos", ngoRoutes);

router.use("/opportunities", opportunityRoutes);

router.use("/applications", applicationRoutes);

router.use("/certificates", certificateRoutes);

router.use("/", certificationRoutes);

router.use("/impact-profile", impactProfileRoutes);

router.use("/notifications", notificationRoutes);

router.use("/", reportRoutes);

router.use("/contributions", contributionRoutes);

export default router;