import express from "express";
import sequelize from "./config/database.js";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";
import errorHandler, {
  serverErrorHandler,
} from "./middleware/errorMiddleware.js";
import path from "path";
import uploadProfileFiles from "./config/multer.js";

//import environment variables
dotenv.config();

const app = express();

//cross origin resource sharing
app.use(
  cors({
    origin: ["http://localhost:5173", "https://impacthub-frontend.vercel.app"],
    credentials: true,
  }),
);

//middleware so we can parse json request
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(
  "/uploads",
  express.static(path.join(import.meta.dirname, "../uploads")),
);

//middleware to store pdfs and qr codes in public
app.use(express.static("src/public"));

//registering all routes
app.use("/api/v1", routes);

// Error Handler
app.use(errorHandler);

//test route
app.get("/api/v1", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to ImpactHub API V1",
    documentation: "https://documenter.getpostman.com/view/54550547/2sBY4TqyCT",
  });
});

// Used to handle (404) NOT FOUND error.
app.use((req, res) => {
  res.status(404).json({
    status: "failed",
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

// Connect to PostgreSQL and start the server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully.");

    //Sync models with the database
    await sequelize.sync({ force: true });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database.");
    console.error(error);
  }
};

startServer();

export default app;
