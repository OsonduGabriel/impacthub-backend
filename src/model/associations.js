import NGO from "./ngoModel.js";
import Opportunity from "./opportunityModel.js";
import Application from "./applicationModel.js";
import Contribution from "./contributionModel.js";
import User from "./userModel.js";
import Certification from "./certificationModel.js";
import Volunteer from "./volunteerModel.js";
import Certificate from "./certificateModel.js";
import Notification from "./notificationModel.js";
import ImpactProfile from "./impactProfileModel.js";

NGO.hasMany(Opportunity, { foreignKey: "ngoId", onDelete: "CASCADE" });
Opportunity.belongsTo(NGO, { foreignKey: "ngoId" });

Opportunity.hasMany(Application, {
  foreignKey: "opportunityId",
  onDelete: "CASCADE",
});
Application.belongsTo(Opportunity, { foreignKey: "opportunityId" });

Opportunity.hasMany(Contribution, {
  foreignKey: "opportunityId",
  onDelete: "CASCADE",
});
Contribution.belongsTo(Opportunity, { foreignKey: "opportunityId" });

Volunteer.hasMany(Application, { foreignKey: "volunteerId" });
Application.belongsTo(Volunteer, {
  foreignKey: "volunteerId",
  as: "volunteer",
});

Volunteer.hasMany(Contribution, { foreignKey: "volunteerId" });
Contribution.belongsTo(Volunteer, {
  foreignKey: "volunteerId",
  as: "volunteer",
});

// Volunteer ↔ Certificate
Volunteer.hasMany(Certificate, {
  foreignKey: "volunteerId",
  onDelete: "CASCADE",
});
Certificate.belongsTo(Volunteer, { foreignKey: "volunteerId" });

// NGO ↔ Certificate
NGO.hasMany(Certificate, { foreignKey: "ngoId" });
Certificate.belongsTo(NGO, { foreignKey: "ngoId" });

// Opportunity ↔ Certificate
Opportunity.hasMany(Certificate, { foreignKey: "opportunityId" });
Certificate.belongsTo(Opportunity, { foreignKey: "opportunityId" });

// User ↔ Notification
User.hasMany(Notification, { foreignKey: "userId", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "userId" });

// Volunteer ↔ Impact Profile
Volunteer.hasOne(ImpactProfile, {
  foreignKey: "volunteerId",
  onDelete: "CASCADE",
});
ImpactProfile.belongsTo(Volunteer, { foreignKey: "volunteerId" });

User.hasOne(Volunteer, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Volunteer.belongsTo(User, { foreignKey: "userId" });

Volunteer.hasMany(Certification, {
  as: "certifications",
  foreignKey: "volId",
  onDelete: "CASCADE",
  hooks: true,
});
Certification.belongsTo(Volunteer, { foreignKey: "volId" });

export {
  NGO,
  Opportunity,
  Application,
  Contribution,
  Volunteer,
  Certificate,
  Notification,
  ImpactProfile,
};