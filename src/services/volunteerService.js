import dotenv from "dotenv";
import Volunteer from "../model/volunteerModel.js";
import sequelize from "../config/database.js";
import User from "../model/userModel.js";

export class VolunteerService {
  async createProfile(user) {
    const result = await sequelize.transaction(async (t) => {
      const [volunteer, created] = await Volunteer.findOrCreate({
        where: {
          fullname: user.fullname,
          email: user.email,
        },
        defaults: {
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
        },
        transaction: t,
      });

      if (!created) {
        throw new Error("Volunteer already Exists");
      }
      user.role = "volunteer";
      user.save();
      return volunteer;
    });
    return result;
  }
}
