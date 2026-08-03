import { customAlphabet } from "nanoid";
import ImpactProfile from "../model/impactProfileModel.js"
import Certificate from "../model/certificateModel.js";
import { where } from "sequelize";

const nanoid = customAlphabet(
    "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    15
)

//get a volunteer's impact profile
export const getImpactProfile = async(volunteerId) => {
    return await ImpactProfile.findOne({where: { volunteerId }})
}

//update the impact profile after a contribution has been verified
export const updateImpactProfile = async(volunteerId, verifiedHours) => {
    
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

    // TODO: Count unique NGOs to avoid updating contributions for the same ngo
    const uniqueNgoCount = await Certificate.count({
        where: {
            volunteerId
        },
        distinct: true,
        col: "ngoId"
    });

    profile.verifiedNgos = uniqueNgoCount;

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
export const getPublicProfile = async(shareableLink) => {
    return await ImpactProfile.findOne({where: {shareableLink, isPublic: true}})
}