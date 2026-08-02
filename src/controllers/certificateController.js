import * as certificateService from "../services/certificateService.js"


//Generate a new certificate - Route: POST / Certificate
export const generateCertificate = async(req, res, next) => {
    try {
        //call the service and pass the data(req.body) from frontend/client use to generate certificate
        const certificate = await certificateService.generateCertificate(req.body)

        res.status(201).json({success: true, message: "Certificate generated successfully", data: certificate})
    } catch (error) {
            console.error("ERROR MESSAGE:", error.message);
        console.error("FULL ERROR:", error);
        //send error to global error handler express middleware
        next(error)
    }
}

//Get all certificates - Route: GET/ certificate
export const getCertificates = async(req, res, next) => {
    try {
        //call the service
        const certificates = await certificateService.getCertificates()

        res.status(200).json({success: true, data: certificates})
    } catch (error) {
        next(error)
    }
}

//get one certificate by database id - Route: Get/certificate/:id
export const generateCertificateById = async(req, res, next) => {
    try {
        const id = req.params.id //from url
        const certificate = await certificateService.generateCertificateById(id)

        if(certificate){
            return res.status(200).json({success: true, data: certificate})
        }

        res.status(404).json({success: false, message: "Certificate not found"})
    } catch (error) {
        next(error)
    }
}

//verify a certificate - Route: GET/certificate/verify/:certificateId
export const verifyCertificate = async(req, res, next) => {
    try {
        const certificate = await certificateService.verifyCertificate(req.params.certificateId)

        if(certificate){
            return res.status(200).json({success: true, message: "Certificate verified successfully", data: certificate})
        }

        res.status(404).json({success: false, message: "Invalid certificate"})
    } catch (error) {
        next(error)
    }
}

//downlaod certificate - Route: GET/certificates/:id/download
export const downloadCertificate = async(req, res, next) => {
    try {
        const pdfUrl = await certificateService.downloadCertificate(req.params.id)

        res.status(200).json({success: true, pdfUrl})
    } catch (error) {
        next(error)
    }
}

//mark a certificate a s downloaded - Route: PATCH/certificates/:id/download
export const markAsDownloaded = async(req, res, next) => {
    try {
        const certificate = await certificateService.markAsDownloaded(req.params.id)

        res.status(200).json({success: true, message: "Certificate downloaded", data: certificate})
    } catch (error) {
        next(error)
    }
}

//Archive a certificate - Route: DELETE/certificates/:id
export const archiveCertificate = async(req, res, next) => {
    try {
        await certificateService.archiveCertificate(req.params.id)
        res.status(200).json({success: true, message: "Certificate archived successfully"})
    } catch (error) {
        next(error)
    }
}