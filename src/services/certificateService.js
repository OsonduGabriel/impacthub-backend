import Certificate from "../model/certificateModel.js";
import Volunteer from "../model/volunteerModel.js";
import Ngo from "../model/ngoModel.js";
import Opportunity from "../model/opportunityModel.js";
import Contribution from "../model/contributionModel.js";

import { generateCertificateId } from "../utils/certificateUtil.js"
import { generateQRCode } from "../utils/qrCodeGenerator.js"
import { generatePDF } from "../utils/pdfGenerator.js"
import { createNotification } from "./notificationService.js";
import { updateImpactProfile } from "./impactProfileService.js";
import { where } from "sequelize";

//*create certifcicate
export const generateCertificate = async(data) => {
    const {volunteerId, ngoId, opportunityId } = data;

    // TODO: Complete later after meeting with team mates
  // Fetch volunteer
  // Fetch NGO
  // Fetch opportunity
  // Validate contribution has been verified

    const certificateId = generateCertificateId()
    const volunteer = await Volunteer.findByPk(volunteerId)
    if (!volunteer) {
        throw new Error("Volunteer not found");
    }
    const volunteerName = `${volunteer.firstname} ${volunteer.lastname}`;

    const ngo = await Ngo.findByPk(ngoId)
    if (!ngo) {
        throw new Error("NGO not found");
    }
    const ngoName = ngo.name;

    const opportunity = await Opportunity.findByPk(opportunityId)
    if (!opportunity) {
        throw new Error("Opportunity not found");
    }
    const opportunityTitle = opportunity.title;
    
    //validate contribution
     const contribution = await Contribution.findOne({
            where: {
                volunteerId: volunteer.userId,
                opportunityId,
                status: "verified"
            }
        });

        if (!contribution) {
            throw new Error(
                "Volunteer contribution has not been verified."
            );
        }

        //avoid duplicates certificate
   const existing = await Certificate.findOne({
        where: {
            volunteerId,
            opportunityId
        }
    });

    if (existing) {
        throw new Error(
            "Certificate has already been generated."
        );
    }

    const verifiedHours = contribution.hoursLogged
    //create qr
    const qrCode = await generateQRCode(certificateId)
    const pdfUrl = await generatePDF({ certificateId, volunteerName, ngoName, opportunityTitle, verifiedHours, qrCode})

   
//create certificate
    const certificate = await Certificate.create({
            certificateId,
            volunteerId,
            ngoId,
            opportunityId,
            verifiedHours,
            qrCode,
            pdfUrl,
            status: "GENERATED",
        })

    // TODO:
  // Update Impact Profile
    await updateImpactProfile(
        volunteerId,
        verifiedHours,
    );

  // Create Notification

  await createNotification({
    userId: volunteer.userId,
    title: "Certificate Available",
    type: "CERTIFICATE_AVAILABLE",
    message: "Congratulations! Your certificate has been generated and is now available for download"
  })

  return {
    certificate,
    volunteerName,
    ngoName,
    opportunityTitle
    };
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

//*Note Contribution.volunteerId currently stores User.id,
//*Note while Certificate.volunteerId stores Volunteer.id.
// Therefore we use volunteer.userId when querying contributions.