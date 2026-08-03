import {DataTypes, ENUM} from "sequelize"
import sequelize from "../config/database.js"

//stores notifications sent to users
const Notification = sequelize.define(
    "Notification",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        type: {
            type: DataTypes.ENUM(
                "REGISTRATION",
                "NGO_APPROVED",
                "APPLICATION_APPROVED",
                "APPLICATION_REJECTED",
                "CONTRIBUTION_VERIFIED",
                "CERTIFICATE_AVAILABLE",
                "OPPORTUNITY_CANCELLED"
            ),
            allowNull: false
        },

        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: "notifications",
        timestamps: true
    }
)

export default Notification