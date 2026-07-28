import dotenv from "dotenv";
import { where } from "sequelize";
import fs from "fs/promises";
import path from "path";
import Volunteer from "../model/volunteerModel.js";
import sequelize from "../config/database.js";

export class VolunteerService {
  async createProfile(user) {
    const result = await sequelize.transaction(async (t) => {
      const [volunteer, created] = await Volunteer.findOrCreate({
        where: {
          firstname: user.firstname,
          email: user.email,
        },
        defaults: {
          userId: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
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

  async updateProfile(userId, details, files) {
    const volunteer = await Volunteer.findOne({ where: { userId } });
    if (!volunteer) {
      throw new Error("Volunteer not found");
    }
    const allowedFields = [
      "profTitle",
      "firstname",
      "lastname",
      "email",
      "phone",
      "state",
      "country",
      "about",
      "experience",
      "websiteUrl",
    ];
    const updates = {};
    allowedFields.forEach((field) => {
      if (details[field] !== undefined) {
        updates[field] = details[field];
      }
    });

    if (details.skills !== undefined) {
      if (typeof details.skills === "string") {
        try {
          updates.skills = JSON.parse(details.skills);
        } catch (error) {
          throw new Error("Invalid JSON format for skills");
        }
      } else {
        updates.skills = details.skills;
      }
    }

    const finalUpdate = await this.uploadFiles(volunteer, updates, files);

    await volunteer.update(finalUpdate);
    return volunteer;
  }

  async uploadFiles(volunteer, updates, files) {
    const removeOldFiles = async (filePath) => {
      console.log("In the Remove file Function");
      console.log(`File Path ${filePath}`);
      if (!filePath) return;
      console.log(`This is the file path ${filePath}`);
      const __dir = path.join(import.meta.dirname, "../../");
      const processedPath = filePath.replace(/^[\/\\]+/, "");
      const absolutePath = path.resolve(__dir, processedPath);
      console.log(`This id the absolute path ${absolutePath}`);
      try {
        //  delete file asynchronously
        await fs.unlink(absolutePath);
      } catch (error) {
        // if volunteer had not uploaded any profile picture before, it throws an ENOENT error code after reading using fs.stat();
        if (error.code !== "ENOENT") {
          console.error(`Failed to delete old file: ${error.message}`);
          throw new Error("Error deleting old file");
        }
      }
    };

    const getRelativePath = (newUrl) => {
      const relativePath = path.relative(
        path.join(import.meta.dirname, "../../"),
        newUrl.path,
      );
      return relativePath.replace(/\\/g, "/");
    };
    const newAvatarUrl = files?.["avatar"]?.[0];
    if (newAvatarUrl) {
      await removeOldFiles(volunteer.avatarUrl);
      updates.avatarUrl = getRelativePath(newAvatarUrl);
    }

    const newDocumentUrl = files?.["document"]?.[0];
    if (newDocumentUrl) {
      await removeOldFiles(volunteer.cvUrl);
      updates.cvUrl = getRelativePath(newDocumentUrl);
    }
    return updates;
  }

  async getProfile(userId) {
    const volunteer = await Volunteer.findOne({ where: { userId } });
    if (!volunteer) {
      throw new Error("Volunteer does not exist");
    }

    return volunteer;
  }

  async getAllVolunteers() {
    const volunteers = await Volunteer.findAll();
    if (!volunteers) {
      throw new Error("No volunter found");
    }

    return volunteers;
  }

  async deleteVolunteer(userId) {
    const deletedVolunteer = await Volunteer.destroy({
      where: { userId },
    });
    const isDeleted = deletedVolunteer > 0;
    if (isDeleted === false) {
      throw new Error("Unable to delete volunteer");
    }
    return isDeleted;
  }
}
