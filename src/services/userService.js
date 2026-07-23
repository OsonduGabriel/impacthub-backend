import User from "../model/userModel.js";

export class UserService {
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
}
