import { NGO } from '../model/associations.js';

export const createNGO = async (userId, data) => {
  const existing = await NGO.findOne({ where: { userId } });
  if (existing) throw new Error('This user already has an NGO profile');
  return NGO.create({ ...data, userId });
};

export const getNGOByUserId = async (userId) => {
  const ngo = await NGO.findOne({ where: { userId } });
  if (!ngo) throw new Error('NGO profile not found');
  return ngo;
};

export const updateNGO = async (userId, data) => {
  const ngo = await getNGOByUserId(userId);
  return ngo.update(data);
};

export const verifyNGO = async (ngoId, decision) => {
  const ngo = await NGO.findByPk(ngoId);
  if (!ngo) throw new Error('NGO not found');
  ngo.verificationStatus = decision; // 'approved' or 'rejected'
  await ngo.save();
  return ngo;
};