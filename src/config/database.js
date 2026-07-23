import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: process.env.DIALECT,
    host: process.env.DB_HOST,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Connection Established Successfully");

    const isSynced = await sequelize.sync({ alter: true });
    if (isSynced) {
      console.log("database tables created/updated");
    }
  } catch (error) {
    console.log("Error connecting:", error);
    throw error;
  }
}

export default sequelize;
