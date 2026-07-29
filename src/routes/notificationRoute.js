import express from "express"
import { getNotifications, readNotification, readAllNotification, removeNotification } from "../controllers/notificationController"

const route = express.Router()

//get all notification
route.get("/", getNotifications)

//mark a notification as read
route.patch("/:id/read", readNotification)

//mark all notifications as read
route.patch("/read-all", readAllNotification)

//delete a notification
route.delete("/:id", removeNotification)

export default route