import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { useActionState } from "react";

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
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          let salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          let salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
    tableName: "users",
    timestamps: true,
  },
);

export default User;
