import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const ImpactProfile = sequelize.define(
    "ImpactProfile",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        volunteerId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        verifiedHours: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        completedOpportunities: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        verifiedNgos: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        shareableLink: {
            type: DataTypes.STRING,
            unique: true
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: ImpactProfile,
        timestamps: true
    }
)

export default ImpactProfile