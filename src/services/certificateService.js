import Certificate from "../model/certificateModel";
import Volunteer from "../model/volunteerModel";
import Ngo from "../model/ngoModel";
import Opportunity from "../model/opportunityModel";
import Contribution from "../model/contributionModel";

import { generateCertificateId } from "../utils/certificateUtil.js"
import { generateQRCode } from "../utils/qrCodeGenerator.js"
import { generatePDF } from "../utils/pdfGenerator.js"
import { where } from "sequelize";

//*create certifcicate
export const generateCertificate = async(data) => {
    const {volunteerId, ngoId, opportunityId, verifiedHours, } = data;

    // TODO: Complete later after meeting with team mates
  // Fetch volunteer
  // Fetch NGO
  // Fetch opportunity
  // Validate contribution has been verified

    const certificateId = generateCertificateId()
    const volunteer = await Volunteer.findByPk(volunteerId)
    const volunteerName = volunteer.fullName

    const ngo = await Ngo.findByPk(ngoId)
    const ngoName = ngo.organizationName

    const opportunity = await Opportunity.findByPk(opportunityId)
    const opportunityTitle = opportunity.opportunityName
    
    const qrCode = await generateQRCode(certificateId)
    const pdfUrl = await generatePDF({ certificateId, volunteerId, ngoId, opportunityId, verifiedHours, qrCode})

    const certificate = await Certificate.create({
        certificateId,
        volunteerName,
        ngoName,
        opportunityTitle,
        verifiedHours,
        qrCode,
        pdfUrl,
        status: "GENERATED",
    })

    // TODO:
  // Update Impact Profile
  // Create Notification

  return certificate;
}

//*Get all certificates
export const getCertificates = async () => {
    return await Certificate.findAll();
}

//*Get a single certificate by primary key
export const generateCertificateById = async (id) => {
    return await Certificate.findByPk(id)
}

//*Verify certificate using certificate id
export const verifyCertificate = async (certificateId) => {
    return await Certificate.findOne({where: { certificateId }})
}

//*Download certificate - returns pdf path/url
export const downloadCertificate = async(id) => {
    const certificate = await Certificate.findByPk(id);

    if(certificate){
        return certificate.pdfUrl;
    }

    throw new Error("Certificate Not Found");
}

//*Mark certificate as downloaded - updates download status
export const markAsDownloaded = async(id) => {
    const certificate = await Certificate.findByPk(id);

    if(certificate){
        certificate.status = "DOWNLOADED";
        await certificate.save()
        return certificate;
    }

    throw new Error("Certificate Not Found");
}

//*Archive certificate - soft delete a certificate instaed of removing it completely
export const archiveCertificate = async(id) => {
    const certificate  = await Certificate.findByPk(id);

    if(certificate){
        certificate.status = "ARCHIVED";
        await certificate.save();
        return certificate;
    }

    throw new Error("Certificate Not Found")
}