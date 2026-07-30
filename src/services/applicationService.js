import Application from "../model/applicationModel";
import Application from "../model/applicationModel";
import Opportunity from "../model/opportunityModel"
import { where } from "sequelize";

//apply for opportunities
export const applyForOpportunity = async(volunteerId, opportunityId) => {
    //check IF the opportunity exist
    const opportunity = await Opportunity.findByPk(opportunityId) 

    if(opportunity){
        //*Volunteer should not apply twice for an application
        const existingApplication = await Application.findOne( {where: {volunteerId, opportunityId}} )
        if(existingApplication){
            throw new Error("You have already applied for this opportunity. Can't apply")
        }
        //create application
        const application = await Application.create({volunteerId, opportunityId, status: "SUBMITTED"})

        return application;
    }

    throw new Error("Opportunity not found")
}

//Withdraw an application
export const withdrawApplication = async(id) => {
    const application = await Application.findByPk(id)

    if(application){
        //*volunteer cannot withdraw once accepted by the NGO
        if(application.status === "ACCEPTED"){
            throw new Error("Accepted Applications cannot be withdrawn")
        }

        //else withdraw appliction
        application.status === "WITHDRAWN"

        await application.save()
        return application
    }

    throw new Error("Application not found")
}

//View all applications for a volunteer
export const getVolunteerApplications = async(volunteerId) => {
    return await Application.findAll({where: {volunteerId}, include: ["opportunity"]})
}