import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"

//generate PDF certificate - this gives the path to the certificate
export const generatePDF = async( {certificateId, volunteerName, ngoName, opportunityTitle, verifiedHours} ) => {

    const uploadDir = path.join("uploads", "certificates")
}