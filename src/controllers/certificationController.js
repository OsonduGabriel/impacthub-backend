import { CertificationService } from "../services/certificationService.js";
import Certification from "./../model/certificationModel.js";
const certificationService = new CertificationService();

export const addCertification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = req.body;
    const certification = await certificationService.addCertification(
      userId,
      data,
    );
    res.status(200).json({ status: "success", certification: certification });
  } catch (error) {
    next(error);
  }
};
