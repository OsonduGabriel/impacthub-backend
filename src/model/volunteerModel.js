import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("volunteer", "NGO admin", "platform admin"),
      allowNull: false,
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
    tableName: "volunteer",
    timestamps: true,
  },
);
