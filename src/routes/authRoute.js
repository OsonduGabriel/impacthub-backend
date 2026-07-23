import { Router } from "express";

const authRouter = Router();

authRouter.get("/register", (req, res) => {
  try {
    res.send("Testing auth route");
  } catch (error) {
    res.status(500);
    res.json({ message: "Error", error: error.message });
  }
});

export default authRouter;
