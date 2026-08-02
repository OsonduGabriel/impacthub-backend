import express from "express"
import { getProfile, toggleSharing, regenerateLink, getSharedProfile } from "../controllers/impactProfileController.js"
import { protect, authorize } from "../middleware/authMiddleware.js";

const route = express.Router()

//get profile
route.get("/", protect, authorize("volunteer"), getProfile)

//enable/disable sharing
route.patch("/share", protect, authorize("volunteer"), toggleSharing)

//generate a new share link
route.patch("/regenerate-link", protect, authorize("volunteer"), regenerateLink)

//get public profile through shared link
route.get("/share/:shareableLink", getSharedProfile)

export default route

//*shareablelink is not protected(public route) because anyone with the shared link should be able to view it.