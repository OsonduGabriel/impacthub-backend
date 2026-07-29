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
}
