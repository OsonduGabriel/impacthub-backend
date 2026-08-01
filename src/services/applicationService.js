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
export const applyForOpportunity = async (userId, opportunityId) => {
  const existing = await Application.findOne({ where: { opportunityId, volunteerId: userId } });
  if (existing) throw new Error('You have already applied for this opportunity');
  return Application.create({ opportunityId, volunteerId: userId, status: 'submitted' });
};
export const withdrawApplication = async (userId, applicationId) => {
  const application = await Application.findByPk(applicationId);
  if (!application) throw new Error('Application not found');
  if(application.volunteerId !== userId) throw new Error('Not authorized to withdraw this application');
  if (application.status === 'accepted') throw new Error('Cannot withdraw an accepted application');
  application.status = 'withdrawn';
  await application.save();
  return application;
};
