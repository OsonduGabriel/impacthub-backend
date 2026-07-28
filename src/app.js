import express from "express"
import sequelize from "./config/database.js";
import dotenv from "dotenv"

//import environment variables
dotenv.config()

const app = express()

//middleware so we can parse json request
app.use(express.json())

//middleware to store pdfs and qr codes in public
app.use(express.static("src/public"));

//test route
app.get("/", (req, res) => {
  res.status(200).json({success: true, message: "Welcome to ImpactHub API"})
})


const PORT = process.env.PORT || 5000;

// Connect to PostgreSQL and start the server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully.");

    // Sync models with the database
    await sequelize.sync();

    console.log("Database synchronized.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to connect to the database.");
    console.error(error);
  }
};

startServer();

export default app