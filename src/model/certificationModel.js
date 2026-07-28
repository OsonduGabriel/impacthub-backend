import sequelize from "../config/database";
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
        key: id,
      },
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
    },
    issueDate: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    underscored: true,
    tableName: "certifications",
    timestamps: true,
  },
);

export default Certification;
