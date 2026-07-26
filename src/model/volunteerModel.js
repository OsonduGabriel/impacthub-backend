import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Volunteer = sequelize.define(
  "Volunteer",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    interests: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profilePhotoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "volunteers",
    timestamps: true,
  },
);

export default Volunteer;
