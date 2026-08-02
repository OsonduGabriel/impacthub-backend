import express from "express"
import { getNotifications, readNotification, readAllNotification, removeNotification } from "../controllers/notificationController.js"
import { protect } from "../middleware/authMiddleware.js";

const route = express.Router()

// Get all notifications
route.get("/", protect, getNotifications);

// Mark one notification as read
route.patch("/:id/read", protect, readNotification);

// Mark all notifications as read
route.patch("/read-all", protect, readAllNotification);

// Delete notification
route.delete("/:id", protect, removeNotification);

export default route