import { getUserNotification, markAsRead, markAllAsRead, deleteNotification } from "../services/notificationService";

//get notifications for a particular user - Route: GET /api/v1/notifications
export const getNotifications = async(req, res, next) => {
    try {
        //this comes from jwt middleware
        const userId = req.user?.id || req.params.userId
        const notifications = await getUserNotification(userId)

        res.status(200).json({success: true, count: notifications.length, data: notifications})
    } catch (error) {
        next(error)
    }
}

//mark a notification as read - Patch /api/v1/notifications/:id/read
export const readNotification = async(req, res, next) => {
    try {
        const notification = await markAsRead(req.params.id)
        res.status(200).json({success: true, message: "Notification mark as read", data: notification})
    } catch (error) {
        next(error)
    }
}

//mark all notifications as read - patch /api/v1/notifications/read-all
export const readAllNotification = async(req, res, next) => {
    try {
        const userId = req.user?.id || req.params.userId
        const notification = await markAllAsRead(userId)
        res.status(200).json({success: true, ...notification})
    } catch (error) {
        next(error)
    }
}

//delete notification - delete /api/v1/notifications/:id
export const removeNotification = async(req, res, next) => {
    try {
        const result = await deleteNotification(req.params.id)
        res.status(200).json({success: true, ...result})
    } catch (error) {
        next(error)
    }
}

//*Note: create notification was not added cause it is called internally by other modules(auth, contribution, certificate, ngo)