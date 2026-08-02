import * as impactProfileService from "../services/impactProfileService.js"

//get impact profile - Route: GET/api/v1/impact-profile
export const getProfile = async(req, res, next) => {
    try {
        //from JWT middleware
        const volunteerId = req.user?.id || req.params.volunteerId

        const profile = await impactProfileService.getImpactProfile(volunteerId)

        if(profile){
            return res.status(200).json({success: true, data: profile})
        }

        return res.status(404).json({success: false, message: "Impact profile not found"})
    } catch (error) {
        next(error)
    }
}

//turn profile sharing on/off - patch api/v1/impact-profile/share
export const toggleSharing = async(req, res, next) => {
    try {
        const volunteerId = req.user?.id || req.params.volunteerId

        const profile = await impactProfileService.profileSharing(volunteerId)

        res.status(200).json({success: true, data: profile, message: "Profile sharing updated"})
    } catch (error) {
        next(error)
    }
}

//create a new shareableLink - patch api/v1/impact-profile/regenerate-link
export const regenerateLink = async(req, res, next) => {
    try {
        const volunteerId = req.user?.id || req.params.volunteerId

        const profile = await impactProfileService.generateShareableLink(volunteerId)

        res.status(200).json({success: true, data: profile, message: "Shareable Link regenerated"})
    } catch (error) {
        next(error)
    }
}

//get public profile from shareableLink - GET api/v1/impact-profile/share/:shareableLink
export const getSharedProfile = async(req, res, next) => {
    try {
        const {shareableLink} = req.params
        const profile = await impactProfileService.getPublicProfile(shareableLink)

        if(profile){
            return res.status(200).json({success: true, data: profile})
        }

        return res.status(404).json({success: false, message: "Public profile not found"})
    } catch (error) {
        next(error)
    }
}

//*Note: update impact profile was not added because it is updated automatically after contributions are verified