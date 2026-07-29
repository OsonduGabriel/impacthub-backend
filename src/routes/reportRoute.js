import express from "express"
import { dashboardStatistics, platformReport } from "../controllers/reportController"

const route = express.Router()

//get dashboard statistics
route.get("/dashboards", dashboardStatistics)

//get platform reports
route.get("/reports", platformReport)

export default route