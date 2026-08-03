import express from "express"
import sequelize from "./config/database.js";
import dotenv from "dotenv"
import cors from "cors"
import routes from "./routes/index.js"

//import environment variables
dotenv.config()

const app = express()

//cross origin resource sharing
app.use(cors({
  origin: ["http://localhost:5173", "https://impacthub-frontend.vercel.app"],
  credentials: true
}))

//middleware so we can parse json request
app.use(express.json())

//middleware to store pdfs and qr codes in public
app.use(express.static("src/public"));

//registering all routes
app.use("/api/v1", routes)


//test route
app.get("/api/v1", (req, res) => {
  res.status(200).json({success: true, message: "Welcome to ImpactHub API V1", documentation: "https://documenter.getpostman.com/view/54550547/2sBY4TqyCT"})
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

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to connect to the database.");
    console.error(error);
  }
};

startServer();

export default app
