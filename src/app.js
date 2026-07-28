import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import uploadProfileFiles from "./config/multer.js";
import { connectDB } from "./config/database.js";
import errorHandler, {
  serverErrorHandler,
} from "./middleware/errorMiddleware.js";
import authRouter from "./routes/authRoute.js";
import { Sequelize } from "sequelize";
import volunteerRouter from "./routes/volunteerRoute.js";
import userRouter from "./routes/userRoute.js";

// Load environment variables. this enables us to use the .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // to parse json request bodies.
app.use(express.urlencoded({ extended: true }));
app.use(
  "/uploads",
  express.static(path.join(import.meta.dirname, "../uploads")),
);

app.use("/api/auth/v1", authRouter);
app.use("/api/auth/v1", volunteerRouter);
app.use("/api/auth/v1", userRouter);

// Error Handler
app.use(errorHandler);

// Used to handle (404) NOT FOUND error.
app.use((req, res) => {
  res.status(404).json({
    status: "failed",
    message: "Route not found",
  });
});

// start server
const startServer = async () => {
  try {
    // connect to the database
    await connectDB();

    // start listening
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    serverErrorHandler(error);
  }
};
startServer();
