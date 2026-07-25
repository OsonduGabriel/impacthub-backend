import { Opportunity, NGO } from '../model/associations.js';

export const createOpportunity = async (userId, data) => {
  const ngo = await NGO.findOne({ where: { userId } });
  if (!ngo) throw new Error('You must have an NGO profile first');
  if (ngo.verificationStatus !== 'approved') {
    throw new Error('Your NGO must be verified before creating opportunities');
  }
  return Opportunity.create({ ...data, ngoId: ngo.id });
};

export const getOpportunities = async (filters = {}) => {
  const where = { status: 'published' };
  if (filters.category) where.category = filters.category;
  if (filters.location) where.location = filters.location;

  return Opportunity.findAll({
    where,
    include: [{ model: NGO, attributes: ['id', 'name'] }],
  });
};

export const getOpportunityById = async (id) => {
  const opportunity = await Opportunity.findByPk(id, { include: [{ model: NGO }] });
  if (!opportunity) throw new Error('Opportunity not found');
  return opportunity;
};

export const updateOpportunity = async (userId, opportunityId, data) => {
  const opportunity = await getOpportunityById(opportunityId);
  const ngo = await NGO.findOne({ where: { userId } });
  if (opportunity.ngoId !== ngo.id) throw new Error('Not authorized to edit this opportunity');
  return opportunity.update(data);
};

export const publishOpportunity = (userId, id) => updateOpportunity(userId, id, { status: 'published' });
export const closeOpportunity = (userId, id) => updateOpportunity(userId, id, { status: 'closed' });

export const deleteOpportunity = async (userId, opportunityId) => {
  const opportunity = await getOpportunityById(opportunityId);
  const ngo = await NGO.findOne({ where: { userId } });
  if (opportunity.ngoId !== ngo.id) throw new Error('Not authorized to delete this opportunity');
  if (opportunity.status !== 'draft') throw new Error('Only draft opportunities can be deleted');
  await opportunity.destroy();
};