import { VolunteerService } from "../services/volunteerService.js";
const volunteerService = new VolunteerService();

export const registerVolunteer = async (req, res) => {
  try {
    const volunteer = await volunteerService.createProfile(req.user);
    return res.status(201).json({ message: "success", data: volunteer });
  } catch (error) {
    return res.status(400).json({ error: "Error", message: error.message });
  }
};
