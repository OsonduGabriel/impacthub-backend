import { getDashboardStatistics, getPlatformReport } from "../services/reportService.js";

//get dashboard statistics - Route: Get /api/v1/dashboard
export const dashboardStatistics = async(req, res, next) => {
    
    try {
       const statistics = await getDashboardStatistics() 
       res.status(200).json({success: true, message: "Dashboard statistics generated", data: statistics})
    } catch (error) {
        next(error)
    }
}

//get platform report - Route: Get /api/v1/reports
export const platformReport = async(req, res, next) => {
    try {
        const report = await getPlatformReport()
        res.status(200).json({success: true, message: "Platform Report generated", data: report})
    } catch (error) {
        next(error)
    }
}