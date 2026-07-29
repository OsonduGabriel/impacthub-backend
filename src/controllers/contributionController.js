import * as contributionService from '../services/contributionService.js';

export const listContributions = async (req, res) => {
  try {
    const contributions = await contributionService.getContributionsForNGO(req.user.id, req.query.opportunityId);
    res.json({ success: true, contributions });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const verifyContribution = async (req, res) => {
  try {
    const contribution = await contributionService.verifyContribution(req.user.id, req.params.id);
    res.json({ success: true, contribution });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const rejectContribution = async (req, res) => {
  try {
    const contribution = await contributionService.rejectContribution(req.user.id, req.params.id);
    res.json({ success: true, contribution });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};