import express from "express"
import * as certificateController from "../controllers/certificateController.js"
import { protect, authorize } from "../middleware/authMiddleware.js";

const route = express.Router()

//generate a new certificate
route.post("/", protect, certificateController.generateCertificate)

//get all certificates
route.get("/", protect, certificateController.getCertificates)

//verify certificate
route.get("/verify/:certificateId", protect, certificateController.verifyCertificate)

//get one certificate by id
route.get("/:id", protect, certificateController.generateCertificateById)

//download certificate
route.get("/:id/download", protect, certificateController.downloadCertificate)

//mark certificate as downloaded
route.patch("/:id/download", protect, certificateController.markAsDownloaded)

//delete certificate
route.delete("/:id", protect, certificateController.archiveCertificate)

export default route