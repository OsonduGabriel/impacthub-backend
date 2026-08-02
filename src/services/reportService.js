import Volunteer from "../model/volunteerModel.js"
import Ngo from "../model/ngoModel.js"
import Opportunity from "../model/opportunityModel.js"
import Contribution from "../model/contributionModel.js"
import Certificate from "../model/certificateModel.js"

import { Sequelize, where } from "sequelize"

//send statistics for the dashboard
export const getDashboardStatistics = async() => {
    //count registers
    const totalVolunteer = await Volunteer.count()

    //count NGOs
    const totalNGO = await Ngo.count()

    //count volunteer opportunities
    const totalOpportunities =  await Opportunity.count()

    //count generated certificates
    const totalCertificate = await Certificate.count()

    //sum all verified volunteer hours
    const verifiedHours = await Contribution.sum("hoursLogged", {where: {status: "verified"}})

    return{totalVolunteer, totalNGO, totalOpportunities, totalCertificate, verifiedHours: verifiedHours || 0}
}

//create platform report. Includes dashboard plus extra analysis
export const getPlatformReport = async() => {
    const dashboard = await getDashboardStatistics()

    const activeOpportunities = await Opportunity.count({where: {status: "open"}})

    const completedContributions = await Contribution.count({where: {status: "verified"}})

    return {...dashboard, activeOpportunities, completedContributions}
}

//*Note: There is no reportModel because the reports are generated dynamically(calculated every time) instead of storing them
