import express from "express"
import * as certificateController from "../controllers/certificateController.js"
import { protect, authorize } from "../middleware/authMiddleware.js";

const route = express.Router()

//generate a new certificate
route.post("/", protect, authorize("ngo", "admin"), certificateController.generateCertificate)

//get all certificates
route.get("/", certificateController.getCertificates)

//verify certificate
route.get("/verify/:certificateId", certificateController.verifyCertificate)

//get one certificate by id
route.get("/:id", certificateController.generateCertificateById)

//download certificate
route.get("/:id/download", certificateController.downloadCertificate)

//mark certificate as downloaded
route.patch("/:id/download", certificateController.markAsDownloaded)

//delete certificate
route.delete("/:id", certificateController.archiveCertificate)

export default route