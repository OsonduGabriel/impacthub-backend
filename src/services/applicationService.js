import { Application, Opportunity, NGO } from '../model/associations.js';

export const getApplicationsForNGO = async (userId, opportunityId) => {
  const ngo = await NGO.findOne({ where: { userId } });
  if (!ngo) throw new Error('NGO profile not found');

  const opportunityWhere = { ngoId: ngo.id };
  if (opportunityId) opportunityWhere.id = opportunityId;

  return Application.findAll({
    include: [{ model: Opportunity, where: opportunityWhere }],
  });
};

const getOwnedApplication = async (userId, applicationId) => {
  const ngo = await NGO.findOne({ where: { userId } });
  if (!ngo) throw new Error('NGO profile not found');

  const application = await Application.findByPk(applicationId, {
    include: [{ model: Opportunity }],
  });
  if (!application) throw new Error('Application not found');
  if (application.Opportunity.ngoId !== ngo.id) {
    throw new Error('Not authorized to manage this application');
  }
  return application;
};

export const acceptApplication = async (userId, applicationId) => {
  const application = await getOwnedApplication(userId, applicationId);
  application.status = 'accepted';
  await application.save();
  return application;
};

export const rejectApplication = async (userId, applicationId) => {
  const application = await getOwnedApplication(userId, applicationId);
  application.status = 'rejected';
  await application.save();
  return application;
};