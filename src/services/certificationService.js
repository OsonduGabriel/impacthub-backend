import Certification from "../model/certificationModel.js";
import Volunteer from "../model/volunteerModel.js";

export class CertificationService {
  async addCertification(userId, data) {
    console.log(userId);
    console.log(data);
    const { institution, degree, fieldOfStudy, duration } = data;
    console.log("after data");
    const volunteer = await Volunteer.findOne({ where: { userId } });
    if (!volunteer) {
      throw new Error("Volunteer not found");
    }
    console.log(volunteer);
    const volId = volunteer.id;
    const [certification, created] = await Certification.findOrCreate({
      where: {
        degree,
        institution,
        fieldOfStudy,
      },
      defaults: {
        volId,
        institution,
        degree,
        fieldOfStudy,
        duration,
      },
    });

    if (!created) {
      throw new Error("Certification already Exists");
    }
    return certification;
  }

  async editCertification(id, certificationId, updates) {
    const volunteer = await Volunteer.findOne({ where: { userId: id } });
    const volId = volunteer.id;
    const changedColumns = await Certification.update(updates, {
      where: { id: certificationId, volId },
      validate: true,
    });

    if (changedColumns === 0) {
      throw new Error("Certification not found or no changes made");
    }
    const certification = await Certification.findByPk(certificationId);
    return certification;
  }

  async getCertification(certificationId) {
    const certification = await Certification.findOne({
      where: { id: certificationId },
    });
    if (!certification) {
      throw new Error("Certification does not exist");
    }

    return certification;
  }

  async getAllCertifications(volId) {
    const certifications = await Certification.findAll({ where: { volId } });
    if (!certifications) {
      throw new Error("No certification found");
    }

    return certifications;
  }

  async deleteCertification(certificationId) {
    const deletedCertification = await Certification.destroy({
      where: { id: certificationId },
    });
    const isDeleted = deletedCertification > 0;
    if (isDeleted === false) {
      throw new Error("Unable to delete Certification");
    }

    return isDeleted;
  }
}
