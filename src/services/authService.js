import dotenv from "dotenv";
import { Op } from "sequelize";
import User from "../model/userModel.js";
import sequelize from "../config/database.js";
import { VolunteerService } from "./volunteerService.js";
const volunteerService = new VolunteerService();
export class AuthService {
  async createUser({ firstname, lastname, email, password, phone }) {
    const [user, created] = await User.findOrCreate({
      where: {
        firstname,
        email,
      },
      defaults: {
        firstname,
        lastname,
        email,
        password,
        phone,
      },
    });

    if (!created) {
      throw new Error("User already Exists");
    }

    return user;
  }

  async loginUser({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Incorrect Email or Password");
    }
    if (user.role === "user") {
      throw new Error("User not registered as Volunteer or NGO Admin");
    }
    user.lastLogin = new Date();
    await user.save();
    return user;
  }

  async confirmEmail({ email }) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("No user found with that email");
    }
    return user;
  }

  async getUserByResetPassword(resetPasswordToken) {
    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });
    if (!user) {
      throw new Error("Invalid or Expired Token");
    }
    return user;
  }

  async getUserById(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async createAdmin(user) {
    user.role = "platform-admin";
    await user.save();
    return user;
  }

  async createNgoAdmin(user) {
    user.role = "NGO-admin";
    await user.save();
    return user;
  }
}