import { nanoid } from "nanoid";
import ImpactProfile from "../model/impactProfileModel"
import { where } from "sequelize";

//get a volunteer's impact profile
export const getImpactProfile = async(volunteerId) => {
    return await ImpactProfile.findOne({where: { volunteerId }})
}

//update the impact profile after a contribution has been verified
export const updateImpactProfile = async(volunteerId, verifiedHours, ngoName) => {
    
    let profile = await ImpactProfile.findOne({where: {volunteerId}})

    //first verified contributx
    if(!profile){
        profile = await ImpactProfile.create({
            volunteerId,
            verifiedHours,
            completedOpportunities: 1,
            verifiedNgos: 1,
            shareableLink: nanoid(15),
            isPublic: false
        })

        return profile
    }

    //add newly verified hours
    profile.verifiedHours += verifiedHours;

    //increase completed opportunities
    profile.completedOpportunities += 1;

    // TODO: Count unique NGOs properly after other backend modules are finished.
    profile.verifiedNGOs += ngoName ? 1 : 0;

    await profile.save()
    return profile

}

//enable/disable public sharing of volunteer profiles
export const profileSharing = async(volunteerId) => {
    const profile = await ImpactProfile.findOne({where: {volunteerId}})

    if(profile){
        profile.isPublic = !profile.isPublic
        await profile.save()
        return profile
    }

    throw new Error("Impact Profile not found")
}

//generate shareable link
export const generateShareableLink = async(volunteerId) => {
    const profile = await ImpactProfile.findOne({where: {volunteerId}})

    if(profile){
        profile.shareableLink = nanoid(15)
        await profile.save()
        return profile;
    }

    throw new Error("Impact Profile not found")
}

//get profile from a shared link
export const getProfile = async(shareableLink) => {
    return await ImpactProfile.findOne({where: {shareableLink, isPublic: true}})
}