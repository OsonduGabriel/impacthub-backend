import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Certificate = sequelize.define(
  "Certificate",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    certificateId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    volunteerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    ngoId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    opportunityId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    verifiedHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    qrCode: {
      type: DataTypes.TEXT,
    },

    pdfUrl: {
      type: DataTypes.TEXT,
    },

    status: {
      type: DataTypes.ENUM("GENERATED", "DOWNLOADED"),
      defaultValue: "GENERATED",
    },

    issuedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "certificates",
    timestamps: true,
  }
);

export default Certificate;