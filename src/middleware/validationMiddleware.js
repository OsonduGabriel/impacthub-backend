import { body, validationResult } from "express-validator";
// to make sure password has at least one lowercase, uppercase, number and special character
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$%&*])/;

export const validateNewUser = [
  body("fullname")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Please provide your full name"),
  body("email").trim().isEmail().withMessage("Please provide a valid email"),
  body("phone")
    .trim()
    .isLength({ min: 11, max: 20 })
    .withMessage("Please provide a valid phone number"),
  body("password")
    .isLength({ min: 8 })
    .matches(regex)
    .withMessage(
      "Password must have at least one lowercase, uppercase, number and special character!",
    ),
  body("role")
    .optional()
    .isIn(["user", "admin", "volunteer"])
    .withMessage("Invalid role specified"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Failed", errors: errors.array() });
    }
    next();
  },
];

export const validateCurrentUser = [
  body("email").trim().isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .matches(regex)
    .withMessage(
      "Password must have at least one lowercase, uppercase, number and special character!",
    ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Failed", errors: errors.array() });
    }
    next();
  },
];
