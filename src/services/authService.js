import dotenv from "dotenv";
import User from "../model/userModel.js";

export class AuthService {
  async createUser({ fullname, email, password, phone, role }) {
    const [user, created] = await User.findOrCreate({
      where: {
        fullname,
        email,
      },
      defaults: {
        fullname,
        email,
        password,
        phone,
        role,
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
    user.lastLogin = new Date();
    await user.save();
    return user;
  }
}
