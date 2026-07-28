import { VolunteerService } from "../services/volunteerService.js";
const volunteerService = new VolunteerService();

export const registerVolunteer = async (req, res) => {
  try {
    const volunteer = await volunteerService.createProfile(req.user);
    return res.status(201).json({ status: "success", data: volunteer });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

export const updateVolunteer = async (req, res, next) => {
  const id = req.user.id;
  const details = req.body;
  const files = req.files;
  try {
    const volunteer = await volunteerService.updateProfile(id, details, files);
    res.status(201).json({ status: "success", volunteer: volunteer });
  } catch (error) {
    next(error);
  }
};

export const getVolunteer = async (req, res, next) => {
  const id = req.user.id;
  try {
    const volunteer = await volunteerService.getProfile(id);
    res.status(200).json({ status: "success", volunteer: volunteer });
  } catch (error) {
    next(error);
  }
};

export const getAllVolunteers = async (req, res, next) => {
  const id = req.user.id;
  try {
    const volunteers = await volunteerService.getAllVolunteers();
    res.status(200).json({ status: "success", volunteers: volunteers });
  } catch (error) {
    next(error);
  }
};

export const deleteVolunteer = async (req, res, next) => {
  const id = req.user.id;
  try {
    await volunteerService.deleteVolunteer(id);
    res
      .status(200)
      .json({ status: "success", message: "Volunteer deleted successfully" });
  } catch (error) {
    next(error);
  }
};
