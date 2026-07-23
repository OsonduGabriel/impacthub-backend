export const validateNewUser = (req, res, next) => {
  const { fullname, email, password, phone, role } = req.body;

  if (!fullname || !email || !password || !phone || !role) {
    return res.status(400).json({ error: "Missing required Field!" });
  }

  if (
    typeof fullname !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof phone !== "string" ||
    typeof role !== "string"
  ) {
    return res.status(400).json({ error: "Invalid Field!" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must have at least 8 characters" });
  }

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$%&*])/;
  const isValid = regex.test(password);
  if (!isValid) {
    return res.status(400).json({
      error:
        "Password must have at least one lowercase, uppercase, number and special character!",
    });
  }

  next();
};
