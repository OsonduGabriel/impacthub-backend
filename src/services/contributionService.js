import { Contribution, Opportunity, NGO } from '../model/associations.js';

const getOwnedContribution = async (userId, contributionId) => {
  const ngo = await NGO.findOne({ where: { userId } });
  if (!ngo) throw new Error('NGO profile not found');

  const contribution = await Contribution.findByPk(contributionId, {
    include: [{ model: Opportunity }],
  });
  if (!contribution) throw new Error('Contribution not found');
  if (contribution.Opportunity.ngoId !== ngo.id) {
    throw new Error('Not authorized to manage this contribution');
  }
  return contribution;
};

export const getContributionsForNGO = async (userId, opportunityId) => {
  const ngo = await NGO.findOne({ where: { userId } });
  if (!ngo) throw new Error('NGO profile not found');

  const opportunityWhere = { ngoId: ngo.id };
  if (opportunityId) opportunityWhere.id = opportunityId;

  return Contribution.findAll({ include: [{ model: Opportunity, where: opportunityWhere }] });
};

export const verifyContribution = async (userId, contributionId) => {
  const contribution = await getOwnedContribution(userId, contributionId);
  contribution.status = 'verified';
  await contribution.save();
  return contribution;
};

export const rejectContribution = async (userId, contributionId) => {
  const contribution = await getOwnedContribution(userId, contributionId);
  contribution.status = 'rejected';
  await contribution.save();
  return contribution;
};
export const logContribution = async (userId, opportunityId, hoursLogged, evidence) => {
  if (!opportunityId || !hoursLogged) throw new Error('Opportunity ID and hours logged are required');
  return Contribution.create({ opportunityId, volunteerId: userId, hoursLogged, evidence, status: 'pending' });
};