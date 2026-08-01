import Volunteer from "../model/volunteerModel"
import Ngo from "../model/ngoModel"
import Opportunity from "../model/opportunityModel"
import Contribution from "../model/contributionModel"
import Certificate from "../model/certificateModel"

import { Sequelize } from "sequelize"

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
    const verifiedHours = await Contribution.sum("verifiedHours")

    return{totalVolunteer, totalNGO, totalOpportunities, totalCertificate, verifiedHours: verifiedHours || 0}
}

//*Note: There is no reportModel because the reports are generated dynamically(calculated every time) instead of storing them
