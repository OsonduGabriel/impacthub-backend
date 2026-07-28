import User from "./userModel.js";
import Volunteer from "./volunteerModel.js";
import Certification from "./certificationModel.js";

User.hasOne(Volunteer, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Volunteer.belongsTo(User, { foreignKey: userId });

Volunteer.hasMany(Certification, {
  as: "certifications",
  foreignKey: "volId",
  onDelete: "CASCADE",
});
Certification.belongsTo(Volunteer, { foreignKey: "volId" });

export default { User, Volunteer, Certification };
