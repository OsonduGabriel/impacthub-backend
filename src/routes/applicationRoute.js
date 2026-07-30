import express from "express"
import { apply, withdraw, getApplications } from "../controllers/applicationController"

//authentication and authorization middleware done by Oluwatosin
import protect from "../middleware/protect.js"
import authorize from "../middleware/authorize.js"

const route = express.Router()

//apply for an opportunity
route.post("/", protect, authorize("VOLUNTEER"), apply)

//volunteer views their application
route.get("/", protect, authorize("VOLUNTEER"), getApplications)

//withdraw application
route.get("/:id/withdraw", protect, authorize("VOLUNTEER"), withdraw)

export default route

//*Note: protect - checks that the user is verified using jwt, authenticated, logged-in and attaches the user id to req.user
//*Note: authorize - checks the user role to make sure only volunteers can apply and not ngo/platform admin