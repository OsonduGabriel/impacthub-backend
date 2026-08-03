import sequelize from "../config/database.js";
import User from "../model/userModel.js";

export class UserService {
  async createUser({ firstname, lastname, email, password, phone, role }) {
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
        role,
      },
    });

    if (!created) {
      throw new Error("User already Exists");
    }

    return user;
  }

  async getAllUsers() {
    const users = await User.findAll();
    if (!users) {
      throw new Error("No user found");
    }

    return users;
  }

  async getUserById(id) {
    const user = User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async editUser(id, updates) {
    const changedColumns = await User.update(updates, {
      where: { id },
      validate: true,
    });

    if (changedColumns === 0) {
      throw new Error("User not found or no changes made");
    }
    const user = await this.getUserById(id);
    return user;
  }

  async deleteUser(id) {
    const deletedUser = await User.destroy({
      where: { id },
    });
    const isDeleted = deletedUser > 0;
    if (isDeleted === false) {
      throw new Error("Unable to delete user");
    }
    return isDeleted;
  }
}