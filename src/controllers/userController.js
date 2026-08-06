import { UserService } from "../services/userService.js";
import { body } from "express-validator";
const userService = new UserService();

export const createNewUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ status: "success", user: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    const user = await userService.editUser(id, updates);
    res.status(201).json({ status: "success", user: user });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await userService.getUserById(id);
    res.status(200).json({ status: "success", user: user });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ status: "success", users: users });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const deleted = await userService.deleteUser(id);
    res
      .status(200)
      .json({ status: "success", message: "user deleted successfully" });
  } catch (error) {
    next(error);
  }
};