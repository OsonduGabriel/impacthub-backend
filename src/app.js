import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database.js";
import { serverErrorHandler } from "./middleware/errorMiddleware.js";
import authRouter from "./routes/authRoute.js";
import { Sequelize } from "sequelize";

// Load environment variables. this enables us to use the .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // to parse json request bodies.
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/auth", authRouter);

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
