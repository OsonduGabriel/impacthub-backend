import Notification from "../model/notificationModel.js";
import { Where } from "sequelize/lib/utils";

//create a new notification - called internally by other modules(auth, contribution, certificate, ngo)
export const createNotification = async({userId, title, message, type}) => {
    const notification = await Notification.create({userId, title, message, type})
    return notification;
}

//get all notifications for a user - newest notification should apper first
export const getUserNotification = async(userId) => {
    const notification = await Notification.findAll({where: {userId}, order: [["createdAt", "DESC"]]})
    return notification;
}

//mark a notification as read
export const markAsRead = async(id) => {
    const notification = await Notification.findByPk(id)

    if(notification){
        notification.isRead = true

        await notification.save()
        return notification
    }

    throw new Error("Notification not found")
}

//mark all notifications as read for a user
export const markAllAsRead = async(userId) => {
    await Notification.update({isRead: true}, {where: {userId}})
    return {message: "All notifications marked as read"}
}

//delete a notification
export const deleteNotification = async(id) => {
    const notification = await Notification.findByPk(id)

    if(notification){
        await notification.destroy()
        return {message: "Notification deleted successfully"}
    }

    throw new Error("Notification not found")
}