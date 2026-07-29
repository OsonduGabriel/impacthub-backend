import { CertificationService } from "../services/certificationService.js";
import Certification from "./../model/certificationModel.js";
import { VolunteerService } from "../services/volunteerService.js";
const certificationService = new CertificationService();
const volunteerService = new VolunteerService();

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

export const updateCertification = async (req, res, next) => {
  const id = req.user.id;
  const certificationId = req.params.id;
  const updates = req.body;
  try {
    const Certification = await certificationService.editCertification(
      id,
      certificationId,
      updates,
    );
    res.status(201).json({ status: "success", certification: Certification });
  } catch (error) {
    next(error);
  }
};

export const getCertification = async (req, res, next) => {
  const id = req.params.id;
  try {
    const certification = await certificationService.getCertification(id);
    res.status(200).json({ status: "success", certification: certification });
  } catch (error) {
    next(error);
  }
};

export const getAllCertification = async (req, res, next) => {
  const id = req.user.id;
  try {
    const volunteer = await volunteerService.getProfile(id);
    if (!volunteer) {
      return res
        .status(404)
        .json({ status: "failed", message: "Error finding volunteer" });
    }
    const volId = volunteer.id;
    const certifications =
      await certificationService.getAllCertifications(volId);
    res.status(200).json({ status: "success", certifications: certifications });
  } catch (error) {
    next(error);
  }
};

export const deleteCertification = async (req, res, next) => {
  const id = req.params.id;
  try {
    await certificationService.deleteCertification(id);
    res.status(200).json({
      status: "success",
      message: "Certification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
