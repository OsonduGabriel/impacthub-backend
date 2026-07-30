import { DataTypes } from "sequelize";
import sequelize from "../config/database";

import User from "./userModel"
import Opportunity from "./opportunityModel"
import { toDefaultValue } from "sequelize/lib/utils";

const Application = sequelize.define(
    "Application",
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
        opportunityId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM("SUBMITTED", "UNDER_REVIEW", "ACCEPTED", "REJECTED", "WITHDRAWN"),
            defaultValue: "SUBMITTED",
            allowNull: false
        }
    },
    {
        tableName: "application",
        timestamps: true
    }
)

//*associations

//one volunteer can have many applications - 1:N
User.hasMany(Application, {
    foreignKey: "volunteerId"
})

Application.belongsTo(User, {
    foreignKey: "volunteerId",
    as: "volunteer"
})

//one opportunity can receive many applications
Opportunity.hasMany(Application, {
    foreignKey: "opportunityId"
})

Application.belongsTo(Opportunity, {
    foreignKey: "opportunityId",
    as: "opportunity"
})

export default Application