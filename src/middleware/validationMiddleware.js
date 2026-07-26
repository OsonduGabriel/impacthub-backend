import { body, validationResult } from "express-validator";
// to make sure password has at least one lowercase, uppercase, number and special character
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$%&*])/;

export const validateNewUser = [
  body("firstname")
    .trim()
    .isLength({ min: 1 })
    .notEmpty()
    .withMessage("Please provide your firstname"),
  body("lastname")
    .trim()
    .notEmpty()
    .withMessage("Please provide your lastname"),
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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "failed", errors: errors.array() });
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
      return res.status(400).json({ status: "failed", errors: errors.array() });
    }
    next();
  },
];

export const validatePassword = [
  body("password")
    .isLength({ min: 8 })
    .matches(regex)
    .withMessage(
      "Password must have at least one lowercase, uppercase, number and special character!",
    ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "failed", error: errors.array() });
    }
    next();
  },
];

export const validateChangePassword = [
  body("oldPassword")
    .isLength({ min: 8 })
    .matches(regex)
    .withMessage("Please enter your current password"),
  body("newPassword")
    .isLength({ min: 8 })
    .matches(regex)
    .withMessage(
      "Password must have at least one lowercase, uppercase, number and special character!",
    ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res
        .status(400)
        .json({ status: "failed", message: "Error", error: errors.array() });
    }
    next();
  },
];
