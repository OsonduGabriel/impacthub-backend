import sequelize from "./config/database.js";

sequelize
  .sync()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));