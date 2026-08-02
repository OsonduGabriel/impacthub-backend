import sequelize from "../config/database.js";
import { DataTypes, UUIDV4 } from "sequelize";

const Certification = sequelize.define(
  "Certification",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },

    volId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "volunteers",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    institution: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    degree: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fieldOfStudy: {
      type: DataTypes.STRING,
      allowNull: null,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    underscored: true,
    tableName: "certifications",
    timestamps: true,
  },
);

export default Certification;