import { body, validationResult } from "express-validator";
// to make sure password has at least one lowercase, uppercase, number and special character
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$%&*])/;
const allowedRoles = ["volunteer", "NGO-admin", "platform-admin"];
export const validateNewUser = [
  body("firstname")
    .trim()
    .isAlpha()
    .isLength({ min: 1 })
    .withMessage("Please provide your firstname"),
  body("lastname").trim().isAlpha().withMessage("Please provide your lastname"),
  body("email").trim().isEmail().withMessage("Please provide a valid email"),
  body("phone")
    .trim()
    .isMobilePhone()
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
    .isIn(allowedRoles)
    .withMessage(`Role must be one of: ${allowedRoles.join(", ")}`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "failed", error: errors.array() });
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
      return res.status(400).json({ status: "failed", error: errors.array() });
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
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: "failed", message: "Error", error: errors.array() });
    }
    next();
  },
];

export const validateUpdateUser = [
  body("password").custom((value) => {
    if (value !== undefined) {
      throw new Error("Admins are not allowed to change user passwords");
    }
    return true;
  }),
  body("firstname")
    .optional()
    .trim()
    .isAlpha()
    .isLength({ min: 1 })
    .withMessage("Please provide your firstname"),
  body("lastname")
    .optional()
    .trim()
    .isAlpha()
    .notEmpty()
    .withMessage("Please provide your lastname"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("phone")
    .optional()
    .trim()
    .isMobilePhone()
    .isLength({ min: 11, max: 20 })
    .withMessage("Please provide a valid phone number"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "failed", error: errors.array() });
    }
    next();
  },
];

export const validateUpdateVolunteer = [
  body("userId").custom((value) => {
    if (value !== undefined) {
      throw new Error("Users are not allowed to change ID");
    }
    return true;
  }),
  body("profTitle")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .isLength({ min: 5 })
    .withMessage("Please provide your Professional Title"),
  body("firstname")
    .optional({ values: "falsy" })
    .trim()
    .isAlpha()
    .isLength({ min: 1 })
    .withMessage("Please provide your firstname"),
  body("lastname")
    .optional({ values: "falsy" })
    .trim()
    .isAlpha()
    .isLength({ min: 1 })
    .withMessage("Please provide your lastname"),
  body("email")
    .optional({ values: "falsy" })
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
  body("state")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .isAlpha()
    .withMessage("Please provide a valid State"),
  body("country")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .isAlpha()
    .withMessage("Please provide a valid Country"),
  body("about")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("Please provide a details about you"),
  body("experience")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("Please provide a valid experience"),
  body("websiteUrl")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Please provide a valid url"),
  body("skills")
    .optional()
    .trim()
    .isArray()
    .isLength({ min: 11, max: 20 })
    .withMessage("Please provide a valid phone number"),
  body("avatarUrl")
    .optional()
    .isURL()
    .withMessage("Please provide a valid avatar"),
  body("cvUrl").optional().isURL().withMessage("Please provide a valid CV"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "failed", errors: errors.array() });
    }
    next();
  },
];

export const validateCertification = [
  body("volId").custom((value) => {
    if (value !== undefined) {
      throw new Error("Users are not allowed to change certification IDs");
    }
    return true;
  }),
  body("institution")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Please enter a valid institution"),
  body("degree")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Please enter a valid institution"),
  body("fieldOfStudy")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Please enter a valid institution"),
  body("duration")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Please enter a valid institution"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "failed", errors: errors.array() });
    }
    next();
  },
];

export const validateUpdateCertification = [
  body("volId").custom((value) => {
    if (value !== undefined) {
      throw new Error("Users are not allowed to change IDs");
    }
    return true;
  }),
  body("id").custom((value) => {
    if (value !== undefined) {
      throw new Error("Users are not allowed to change IDs");
    }
    return true;
  }),
  body("institution")
    .optional()
    .trim()
    .isString()
    .withMessage("Please enter a valid institution"),
  body("degree")
    .trim()
    .optional()
    .isString()
    .withMessage("Please enter a valid institution"),
  body("fieldOfStudy")
    .trim()
    .optional()
    .isString()
    .withMessage("Please enter a valid institution"),
  body("duration")
    .trim()
    .optional()
    .isString()
    .withMessage("Please enter a valid institution"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "failed", errors: errors.array() });
    }
    next();
  },
];
