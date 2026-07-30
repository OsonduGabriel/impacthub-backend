import { applyForOpportunity, withdrawApplication, getVolunteerApplications } from "../services/applicationService";

//apply for an opportunity - Route: POST /applications
export const  apply = async(req, res, next) => {
    try {
        //get the opportunity
        const {opportunityId} = req.body

        //get volunteer id from jwt
        const volunteerId = req.user.id
        //apply
        const application = await applyForOpportunity(volunteerId, opportunityId)

        res.status(201).json({success: true, message: "Application submitted successfully", data: application})
    } catch (error) {
        next(error)
    }
}

//withdraw an application - Patch /applications/:id/withdraw
export const withdraw = async(req, res, next) => {
    try {
        //get application id from url
        const {applicationId} = req.params

        //get the correct volunteer
        const volunteerId = req.user.id
        //withdraw
        const application = await withdrawApplication(applicationId, volunteerId)

        res.status(200).json({success: true, message: "Application withdrawn successfully", data: application})
    } catch (error) {
        next(error)
    }
}

//get all applications for a volunteer - Get /applications
export const getApplications = async(req, res, next) => {
    try {
        const volunteerId = req.user.id
        //fetch applications
        const applications = await getVolunteerApplications(volunteerId)

        res.status(200).json({success: true, count: applications.length, data: applications})
    } catch (error) {
        next(error)
    }
}