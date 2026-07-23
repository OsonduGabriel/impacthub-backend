import { UserService } from "../services/userService.js";
const userService = new UserService();
export const register = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return res
      .status(201)
      .json({ message: "User added successfuly", user: user });
  } catch (error) {
    console.log(error.code);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "A user with this phone number or email already exists",
        // this means that there is a conflict. caused by the unique nature of email and phone number
      });
    }
    res
      .status(500)
      .json({ message: "Error adding user", error: error.message });
  }
};
