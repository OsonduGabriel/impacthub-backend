import express from "express"
import { getProfile, toggleSharing, regenerateLink, getSharedProfile } from "../controllers/impactProfileController"

const route = express.Router()

//get profile
route.get("/", getProfile)

//enable/disable sharing
route.patch("/share", toggleSharing)

//generate a new share link
route.patch("/regenerate-link", regenerateLink)

//get public profile through shared link
route.get("/share/:shareableLink", getSharedProfile)

export default route